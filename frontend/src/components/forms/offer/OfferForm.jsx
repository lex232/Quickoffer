import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import offer_api from '../../../api/offer_api';
import { XCircle } from 'react-feather'

import ChooseClientPopup from '../../popup/ChooseClientPopup';

import './styles.css'

const OfferForm = ({
  id,
  name_offer,
}) => {
  /**
  * Форма КП с элементами
  */

  const navigate = useNavigate()

  let nameFromLocal = name_offer
  const [ nameArea, setName ] = useState(name_offer)
  //const [ clientArea, setClient ] = useState(name_client)
  // const [ statusOffer, setStatusOffer] = useState(status_type);

  const classValid = 'form-control border-input'
  const classIsInvalid = 'form-control border-input is-invalid'
  const [ classForNameArea, setClassForNameArea] = useState(classValid);

  // Самая главная переменная - итоговый список КП
  let items = []

  // Извлекаем из локального хранилища в корзину
  if (localStorage.getItem("items")) {
    items = JSON.parse(localStorage.getItem("items"));
  }

  //Извлекаем из локального хранилища имя КП
  if (localStorage.getItem("nameoffer") && name_offer === undefined) {
    nameFromLocal = localStorage.getItem("nameoffer")
  }

  // //Извлекаем из локального хранилища статус редактирования КП
  // if (localStorage.getItem("editable")) {
  //   editable_marker = localStorage.getItem("editable")
  // }
  
  // статус редактирования КП
  const [ editable, setEditable ] = useState(id)

  // UseEffect проверяет статус КП при загрузке страницы
  useEffect(_ => {
    let editable = localStorage.getItem('editable')
    if (editable) {
      setEditable(editable)
    }
  }, []);

  // Итоговая стоимость КП
  const [ finallyPrice, setFinallyPrice ] = useState(0)

  // clientValue - выбранный клиент из Popup окна
  const [ clientValue, setClientValue ] = useState({
    title: '',
    id: null
  })

  // Извлекаем из локального хранилища в корзину
  if (localStorage.getItem("nameclient") && clientValue.id === null) {
    let client = JSON.parse(localStorage.getItem("nameclient"));
    setClientValue(client)
  }

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

  // UseEffect для подсчета цены
  useEffect(_ => {
    calculateFinalPrice()
  }, [list])

   // UseEffect для смены класса имени КП, подсветит красным, если не заполнено
   useEffect(_ => {
    if (nameArea === undefined || nameArea.length === 0) {
      setClassForNameArea(classIsInvalid)
    }
    else if (nameArea !== undefined && nameArea.length === 0) {
      setClassForNameArea(classIsInvalid)
    }
    else {
      setClassForNameArea(classValid)
    }
  }, [nameArea])

  useEffect(_ => {
    setName(nameFromLocal)
  }, [nameFromLocal])


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

  const deleteCurrentClient = (e) => {
    // Удаляем клиента
    localStorage.removeItem("nameclient")
    setClientValue({
      title: '',
      id: null
    })
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
    // Меняем в словаре значение количества
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

  const handleChangeName = (e) => {
    // Устанавливаем имя категории на событии onChange
    e.preventDefault();
    setName(e.target.value);
    localStorage.setItem("nameoffer", e.target.value);
  }

  const ClearOffer = () => {
    // Очищаем локал сторедж, имя КП и состояние списка товаров, клиента
    localStorage.removeItem("items")
    localStorage.removeItem("nameoffer")
    localStorage.removeItem("nameclient")
    localStorage.removeItem("editable")
    setClientValue({
      title: '',
      id: null
    })
    items = []
    setList([])
    window.dispatchEvent(new Event("storage"));
  }



  function handlePostCLiсk(edit, e) {
    // Обработать клик публикации
    e.preventDefault();

    const data = {
      title: nameArea,
      client: clientValue.id,
      // status_type: statusOffer,
      status_type: 'in_edit',
      items_for_offer: list,
    }
    if (edit === false) {
      // Если флаг edit is false
      offer_api.createOffer(data)
      // Чистим корзину
      ClearOffer()
      return navigate("/profile/offer/list")
    } else if (edit === true) {
      // Иначе PATCH
      data.id = editable
      offer_api.updateOffer(data)
      ClearOffer()
      return navigate("/profile/offer/list")
    }
  }

  return (
      <form>
        <div className="row mx-0 my-1 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Название КП* :</label>
                <input type="header" defaultValue={nameArea}
                className={classForNameArea}
                id="offerName" placeholder="Название КП *" onChange={(e) => handleChangeName(e)} /> 
            </div>
          </div>
          {/* <div className="col-md-6 ps-0 pe-2">
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
          </div> */}
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Выбранный клиент: </label>
                {clientValue.title ? 
                <b> {clientValue.title} <button className='' onClick={(e) => deleteCurrentClient(e)}><XCircle strokeWidth={3} size={18} color="red" /></button> </b> :
                ' Клиент не выбран'} 
                <div>
                  {clientValue.title ? <ChooseClientPopup action={setClientValue} text='Изменить клиента'/> : <ChooseClientPopup action={setClientValue} text='Выбрать клиента'/>}
                </div>
            </div>
          </div>
        </div>

        <div className="row mx-0 my-1 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Добавить товары в КП можно через</label>
                <div className='pt-0'><Link to="/catalog"><button className="btn btn-primary btn">каталог товаров</button></Link></div>
                  {/* <input className="form-control mt-1" id="offerName" placeholder="Начните вводить название для поиска"
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
                <div className='pt-2'>или перейдите в <Link to="/catalog"><button className="btn btn-primary btn">каталог товаров</button></Link></div>
            </div> */}
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
                    <div className="card rounded-3 mb-0">
                      <div className="card-body p-0 mx-0">
                        <div className="row mt-1 mb-0 ms-0 me-0">

                          <div className="col-md-6 col-lg-6 col-xl-6 row m-0 p-0 d-flex align-items-center ">
                            <div className="col-4">
                              <img src={item.image} className="img-fluid offer-image-max rounded-3"></img>
                            </div>
                            <div className="col-8 d-flex align-items-center">
                              <span className="fw-normal mb-2">{item.title}</span>
                            </div>
                          </div>  
                          
                          <div className="col-md-2 col-lg-2 col-xl-2 offer-text-min row m-0 p-0">
                            <div className="col-6 col-lg-12">
                              <label>Розничная цена</label>
                              <input value={item.item_price_retail} className="form-control offer-min-form mb-1" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'item_price_retail', e)} />
                            </div>
                            <div className="col-6 col-lg-12 pb-2">
                              <label>Закупочная цена</label>
                              <input value={item.item_price_purchase} className="form-control offer-min-form" id={index+1} placeholder="Цена закупки*" onChange={(e) => handleChangeValue(index, 'item_price_purchase', e)} />
                            </div>
                          </div>

                          <div className="col-md-4 col-lg-4 col-xl-4 offer-text-min row m-0 p-0 pb-2">
                            <div className="col-4">
                              <label>Кол-во</label>
                              <input value={item.amount} className="form-control offer-min-form" id={index+1} placeholder="Кол-во*" onChange={(e) => handleChangeValue(index, 'amount', e)} />
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
            <div className='justify-content-start col-12'>
              {editable ? <div className=''><button onClick={(e) => handlePostCLiсk(false, e)} className="btn btn-primary mt-3 me-3 float-start">Сохранить как новое КП</button> 
              <button onClick={(e) => handlePostCLiсk(true, e)} className="btn btn-primary mt-3 float-start">Перезаписать</button></div>
              : 
              <button onClick={(e) => handlePostCLiсk(false, e)} className="btn btn-primary mt-3 float-start">Опубликовать</button>}         
            </div>
            <div className='justify-content-end col-12'>
              <button onClick={(e) => ClearOffer()} type="button" className="btn btn-outline-secondary float-end">Очистить КП</button>
            </div>
          </div>
      </form>
  );
};

export default OfferForm;