import React, { useEffect, useState, useRef } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';

import items_api from '../../../api/items_api';
import clients_api from '../../../api/clients_api';
import offer_api from '../../../api/offer_api';

import { ReactComponent as PlusIco } from '../../../static/image/icons/plus-square.svg'
import { XCircle } from 'react-feather'

import ItemSearch from '../../item-search';
import ClientsSearch from '../../clients-search';
import SimpleDivMessage from '../../messages';
import './styles.css'

const OfferForm = ({
  id,
  name_offer,
  name_client,
  status_type
}) => {
  /**
  * Форма КП с элементами
  */

  const navigate = useNavigate()
  const [ nameArea, setName ] = useState(name_offer)
  const [ clientArea, setClient ] = useState(name_client)
  const [ statusOffer, setStatusOffer] = useState(status_type);

  // Самая главная переменная - итоговый список КП
  let items = []

  // Сохраняем корзину в локальное хранилище
  if (localStorage.getItem("items")) {
    items = JSON.parse(localStorage.getItem("items"));
  }
  
  // Итоговая стоимость КП
  const [ finallyPrice, setFinallyPrice ] = useState(0)
  
  // Блок поиска для товаров
  // itemList - полученный список товаров из бэкенда (поиска API)
  const [ itemList, setItemList ] = useState()
  // itemValue - в процессе поиска используем title,
  // По завершению поиска - заполняем все поля
  const [ itemValue, setItemValue ] = useState({
    title: '',
    price_retail: 0,
    image: '',
    description: '',
    id: null
  })
  // Показывать ли div с результатами поиска?
  const [ showItems, setShowItems ] = useState(false)

  // Показывать ли div с ошибкой
  const [ showError, setShowError ] = useState(false)

  // Блок поиска для клиентов
  // clientsList - полученный список клиентов из бэкенда (поиска API)
  const [ clientList, setClientList ] = useState()
  // clientValue - в процессе поиска используем title,
  // По завершению поиска - заполняем все поля
  const [ clientValue, setClientValue ] = useState({
    title: '',
    id: null
  })
  // Показывать ли div с результатами поиска клиентов?
  const [ showClients, setShowClients ] = useState(false)

  // состояние DragNDrop
  const initialDnDState = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: []
    }

  // Состояние листа DragNDrop
  const [list, setList] = useState(items);
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);

  // UseEffect для динамического поиска товаров
  useEffect(_ => {
    if (itemValue.title === '') {
      return setItemList([])
    }
    setShowError(false)
    items_api
      .findItem({ item: itemValue.title })
      .then(inputitems => {
        setItemList(inputitems)
      })
  }, [itemValue.title])

  // UseEffect для динамического поиска клиентов
  useEffect(_ => {
    if (clientValue.title === '') {
      return setClientList([])
    }
    clients_api
      .findClient({ client: clientValue.title })
      .then(clientsitems => {
        setClientList(clientsitems)
      })
  }, [clientValue.title])

  useEffect(_ => {
    calculateFinalPrice()
    console.log("LIST CHANGED OFFER", list)
    console.log("LOCALSTORAGE STATE", JSON.parse(localStorage.getItem("items")))
  }, [list])

  // onDragStart fires when an element
  // starts being dragged

  const onDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);
    
    setDragAndDrop({
    ...dragAndDrop,
    draggedFrom: initialPosition,
    isDragging: true,
    originalOrder: list
    });
     
     
    // Для firefox. Это не используется, но без этого DnD не работает. 
    event.dataTransfer.setData("text/html", '');
  }
  
  // onDragOver fires when an element being dragged
  // enters a droppable area.
  // In this case, any of the items on the list
  const onDragOver = (event) => {
    
    // in order for the onDrop event to fire, we have to cancel out this one
    event.preventDefault();
     
    let newList = dragAndDrop.originalOrder;
  
    // index of the item being dragged
    const draggedFrom = dragAndDrop.draggedFrom; 
  
    // index of the droppable area being hovered
    const draggedTo = Number(event.currentTarget.dataset.position); 
  
    const itemDragged = newList[draggedFrom];
    const remainingItems = newList.filter((item, index) => index !== draggedFrom);
   
      newList = [
       ...remainingItems.slice(0, draggedTo),
       itemDragged,
       ...remainingItems.slice(draggedTo)
      ];
       
     if (draggedTo !== dragAndDrop.draggedTo){
      setDragAndDrop({
       ...dragAndDrop,
       updatedOrder: newList,
       draggedTo: draggedTo
      })
     }
   
  }
    
  const onDrop = (event) => {
    
    setList(dragAndDrop.updatedOrder);
    
    setDragAndDrop({
    ...dragAndDrop,
    draggedFrom: null,
    draggedTo: null,
    isDragging: false
    });
  }
   
  const onDragLeave = () => {
    setDragAndDrop({
    ...dragAndDrop,
    draggedTo: null
    });
    
  }

  const deleteItemOffer = (index, e) => {
    // Удаляем элемент из списка товаров/услуг по индексу
    e.preventDefault();

    let prepareToDeleteList = list;
    prepareToDeleteList.splice(index, 1)
    setList(prepareToDeleteList);
    localStorage.setItem("items", JSON.stringify(list));

    setDragAndDrop({
      ...dragAndDrop,
      updatedOrder: prepareToDeleteList,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false
    });
    calculateFinalPrice()
    window.dispatchEvent(new Event("storage"));
  }

  const handlePlusItem = (e) => {
    // Добавляем элемент в список товаров/услуг
    e.preventDefault();

    let prepareToAddList = list;

    if (CheckSameItem(itemValue.id)) {

      prepareToAddList.push({
        id: itemValue.id,
        title: itemValue.title,
        item_price_retail: itemValue.price_retail,
        item_price_purchase: itemValue.price_retail,
        amount: "1",
        description: itemValue.description ,
        image: itemValue.image,
        // position: list.length + 1,
      })
      setList(prepareToAddList);
      localStorage.setItem("items", JSON.stringify(list));

      setDragAndDrop({
        ...dragAndDrop,
        draggedFrom: null,
        draggedTo: null,
        isDragging: false
      });
      calculateFinalPrice()
    }
    window.dispatchEvent(new Event("storage"));
  }

  const calculateFinalPrice = () => {
    // Подсчет итого
    let temp_final = 0
    list.map((item, index) => {
      temp_final += (item.item_price_retail * item.amount)
    })
    setFinallyPrice(temp_final)
  }

  const handleChangeValue = (index, key, e) => {
    // Меняем в словаре значение
    e.preventDefault();

    let prepareToChangeList = list;
    prepareToChangeList[index][key] = e.target.value
    setList(prepareToChangeList);
    localStorage.setItem("items", JSON.stringify(list));
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false
    });

    calculateFinalPrice();
  }

  const handleItemAutofill = ({ id, title, price_retail, image, description}) => {
    // Заполнение параметров товара при добавлении
    setItemValue({
      id,
      title,
      price_retail,
      image,
      description
    })
  }

  const handleClientAutofill = ({ id, title}) => {
    // Заполнение параметров клиента при добавлении
    setClientValue({
      id,
      title
    })
  }

  const handleChangeName = (e) => {
    // Устанавливаем имя категории на событии onChange
    e.preventDefault();
    setName(e.target.value);
  }

  const ClearOffer = () => {
    // Очищаем локал сторедж и состояние списка товаров
    localStorage.removeItem("items")
    items = []
    setList([])
  }

  const CheckSameItem = (id_add) => {
    // Проверяем на одинаковый товар
    var index
    for (index = 0; index < list.length; ++index) {
      if (id_add === list[index].id) {
        setShowError(true)
        return false
      }
    }
    return true
  }

  function handlePostCLiсk(e) {
    // Обработать клик публикации
    e.preventDefault();

    const data = {
      title: nameArea,
      client: clientValue.id,
      status_type: statusOffer,
      items_for_offer: list,
    }
    if (id === undefined) {
      // Если из состояния не пришел id, отправляем POST запрос
      offer_api.createOffer(data)
      // Чистим корзину
      ClearOffer()
      return navigate("/profile/offer/list")
    } else {
      // Иначе PATCH
      data.cat_id = id
      offer_api.createOffer(data)
      return navigate("/profile/offer/list")
    }
  }

  return (
      <form>
        <div className="row mx-0 my-1 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Название КП* :</label>
                <input type="header" defaultValue={name_offer} className="form-control border-input" id="offerName" placeholder="Название КП *" onChange={(e) => handleChangeName(e)} /> 
            </div>
          </div>
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Статус КП:</label>
                <select className='form-select border-input' value={statusOffer} aria-label="Товар или услуга *" id="StatusType" onChange={(e) => setStatusOffer(e.target.value)}>
                  <option value='in_edit'>на редактировании</option>
                  <option value='in_process'>КП отправлено</option>
                  <option value='in_prepayment'>Выставлен счет</option>
                  <option value='in_install'>в работе</option>
                  <option value='in_payment'>получена оплата</option>
                  <option value='denied'>отказано</option>
                </select>
            </div>
          </div>
        </div>

        <div className="row mx-0 my-1 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
              <label>Добавить клиента:</label>
                <input className="form-control my-1" id="clientName" placeholder="Клиент. Начните вводить текст для поиска" 
                    onChange={e => {
                      const valueForClient = e.target.value
                      setClientValue({
                        title: valueForClient
                      })
                    }}
                  onFocus={_ => {
                    setShowClients(true)
                  }}
                  value={clientValue.title} />
            </div>
          </div>
          <div>
            {showClients && clientList.length > 0 && <ClientsSearch
              clients={clientList}
              onClick={({ id, title }) => {
                handleClientAutofill({ id, title })
                setClientList([])
                setShowClients(false)
            }}/>
            }
          </div>

          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Добавить товар/ услугу через поиск</label>
                  <input className="form-control mt-1" id="offerName" placeholder="Начните вводить название для поиска" 
                    onChange={e => {
                      const valueForItem = e.target.value
                      setItemValue({
                        title: valueForItem
                      })
                    }}
                  onFocus={_ => {
                    setShowItems(true)
                  }}
                  value={itemValue.title} />
                <div>
                  {showItems && itemList.length > 0 && <ItemSearch
                    items={itemList}
                    onClick={({ id, title, price_retail, image, description }) => {
                      handleItemAutofill({ id, title, price_retail, image, description })
                      setItemList([])
                      setShowItems(false)
                  }} />
                  }
                  {itemValue.id && 
                    <button onClick={(e) => handlePlusItem(e)}><PlusIco fill="green" transform='scale(1)' baseProfile='tiny' width={24} /><span className='ps-2'>Добавить позицию</span></button>
                  }

                  {showError && <div className='mt-2'><SimpleDivMessage text='Такой элемент уже есть в списке'/>
                </div>}
                <div className='pt-2'>или перейдите в <Link to="/catalog"><button className="btn btn-primary btn-sm">каталог товаров</button></Link></div>
            </div>
            </div>
          </div>
        </div>


          <div>
           <section className='itemsforoffer mx-0 px-0'>
              {list.map((item, index) => {
                return(
                  <div
                      key={index}
                      data-position={index}
                      draggable
                      onDragStart={onDragStart}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                      onDragLeave={onDragLeave}
                      className={dragAndDrop && dragAndDrop.draggedTo=== Number(index) ? "dropArea row d-flex justify-content-center px-0 mx-0" : "row d-flex justify-content-center px-0 mx-0"}
                  >
                    <div className="card rounded-3 mb-2">
                      <div className="card-body p-0 mx-0">
                        <div className="row  mb-0 ms-0 me-0">

                          <div className="col-md-6 col-lg-6 col-xl-6 row m-0 p-0 d-flex align-items-center ">
                            <div className="col-4">
                              <img src={item.image} className="img-fluid offer-image-max rounded-3"></img>
                            </div>
                            <div className="col-8 d-flex align-items-center">
                              <span className="fw-normal mb-2">{item.title}</span>
                              {/* <p><span className="text-muted">Size: </span>M <span className="text-muted">Color: </span>Grey</p> */}
                            </div>
                          </div>  
                          
                          <div className="col-md-2 col-lg-2 col-xl-2 offer-text-min row m-0 p-0">
                            <div className="col-6 col-lg-12">
                              <label>Розничная цена</label>
                              <input value={item.item_price_retail} className="form-control offer-min-form mb-1" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'item_price_retail', e)} />
                            </div>
                            <div className="col-6 col-lg-12 pb-2">
                              <label>Закупочная цена</label>
                              <input value={item.item_price_purchase} className="form-control offer-min-form" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'item_price_purchase', e)} />
                            </div>
                          </div>

                          <div className="col-md-4 col-lg-4 col-xl-4 offer-text-min row m-0 p-0 pb-2">
                            <div className="col-4">
                              <label>Кол-во</label>
                              <input value={item.amount} className="form-control offer-min-form" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'amount', e)} />
                            </div>
                            <div className="col-6">
                              <label>Итого</label>
                              <h5 className="mb-0">{item.item_price_retail * item.amount} Р</h5>
                            </div>
                            <div className="col-2 d-flex align-items-center">
                            <button onClick={(e) => deleteItemOffer(index, e)}><XCircle strokeWidth={3} size={22} color="red" /></button>
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div>
                <b>Итого: </b>
                <b>{finallyPrice} руб.</b>
              </div>
           </section>
           </div>
           <div className="btn-toolbar d-flex align-items-end mb-4">
            <div className='justify-content-start col-6'>
              <button onClick={(e) => handlePostCLiсk(e)} className="btn btn-medium btn-primary mt-3 float-start">Опубликовать</button>         
            </div>
            <div className='justify-content-end col-6'>
              <button onClick={(e) => ClearOffer()} type="button" className="btn btn-medium btn-outline-secondary float-end">Очистить КП</button>
            </div>
          </div>
      </form>
  );
};

export default OfferForm;