import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import items_api from '../../../api/items_api';

import { ReactComponent as PlusIco } from '../../../static/image/icons/plus-square.svg'
import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'
import ItemSearch from '../../item-search';
import './styles.css'

const OfferForm = ({
  id,
  name_offer,
  name_client,
  status_type
}) => {

  const navigate = useNavigate()
  const [ nameArea, setName ] = useState(name_offer)
  const [ clientArea, setClient ] = useState(name_client)

  // Самая главная переменная - итоговый список КП
  let items = []

  if (localStorage.getItem("items")) {
    items = JSON.parse(localStorage.getItem("items"));
    console.log('local_storage yes')
  }
  
  // Итоговая стоимость КП
  const [ finallyPrice, setFinallyPrice ] = useState(0)
  
  // itemList - полученный список из бэкенда (поиска API)
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

  // состояние DragNDrop
  const initialDnDState = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: []
    }

  // sd
  const [list, setList] = useState(items);
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);

  useEffect(_ => {
    if (itemValue.title === '') {
      return setItemList([])
    }
    console.log("item", itemList, "ITEM LEN", itemList.length, "SHOW ITEM", showItems, "ITEM_VALUE", itemValue)
    items_api
      .findItem({ item: itemValue.title })
      .then(inputitems => {
        setItemList(inputitems)
      })
  }, [itemValue.title])
    
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
     
     
    // Note: this is only for Firefox.
    // Without it, the DnD won't work.
    // But we are not using it.
    event.dataTransfer.setData("text/html", '');
  }
  
  // onDragOver fires when an element being dragged
  // enters a droppable area.
  // In this case, any of the items on the list
  const onDragOver = (event) => {
    
    // in order for the onDrop
    // event to fire, we have
    // to cancel out this one
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
    // Удаляем элемент в список товаров/услуг
    e.preventDefault();

    let prepareToDeleteList = list;
    delete prepareToDeleteList[index]
    setList(prepareToDeleteList);
    localStorage.setItem("items", JSON.stringify(list));

    setDragAndDrop({
      ...dragAndDrop,
      updatedOrder: prepareToDeleteList,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false
    });
  }

  const handlePlusItem = (e) => {
    // Добавляем элемент в список товаров/услуг
    e.preventDefault();

    let prepareToAddList = list;
    prepareToAddList.push({
      title: itemValue.title,
      price: itemValue.price_retail,
      purchase_price: itemValue.price_retail,
      quantity: "1",
      description: itemValue.description ,
      image: itemValue.image
    })
    setList(prepareToAddList);
    localStorage.setItem("items", JSON.stringify(list));

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false
    });
  }

  const calculateFinalPrice = () => {
    let temp_final = 0
    list.map((item, index) => {
      temp_final += item.purchase_price
    })
    setFinallyPrice(temp_final)
  }

  const handleChangeValue = (index, key, e) => {
    // Меняем в словаре значение
    e.preventDefault();

    let prepareToChangeList = list;
    prepareToChangeList[index][key] = e.target.value
    setList(prepareToChangeList);
    
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false
    });

    calculateFinalPrice();
  }

  const handleItemAutofill = ({ id, title, price_retail, image, description}) => {
    setItemValue({
      id,
      title,
      price_retail,
      image,
      description
    })
  }

  const handleChangeName = (e) => {
    // Устанавливаем имя категории на событии onChange
    e.preventDefault();
    setName(e.target.value);
  }

  const handleChangeClient = (e) => {
    // Устанавливаем slug категории на событии onChange
    e.preventDefault();
    setClient(e.target.value);
  }

  function handlePostCLiсk(e) {
    // Обработать клик
    e.preventDefault();

    const data = {
      title: nameArea,
      client: clientArea,
    }
    if (id === undefined) {
      // Если из состояния не пришел id, отправляем POST запрос
      items_api.createCategoryFreeSW(data)
      return navigate("/admin/freesw")
    } else {
      // Иначе PATCH
      data.cat_id = id
      items_api.updateCategoryFreeSW(data)
      return navigate("/admin/freesw")
    }
  }

  return (
      <form>
          <div className="form">
            <input type="header" defaultValue={name_offer} className="form-control my-3" id="offerName" placeholder="Название КП *" onChange={(e) => handleChangeName(e)} /> 
          </div>
          <div className="form">
            <input type="header" defaultValue={name_client} className="form-control my-3" id="offerClient" placeholder="Клиент. Начните вводить текст для поиска" onChange={(e) => handleChangeClient(e)} />
          </div>
          <div>
            <div>
              
              <span className='ps-2'>Добавить товар/ услугу</span>
              <input className="form-control my-3" id="offerName" placeholder="Товар/ услуга. Начните вводить текст для поиска" 
                onChange={e => {
                  const value = e.target.value
                  setItemValue({
                    title: value
                  })
                }}
              onFocus={_ => {
                setShowItems(true)
              }}
              value={itemValue.title} /> 

              {showItems && itemList.length > 0 && <ItemSearch
                items={itemList}
                onClick={({ id, title, price_retail, image, description }) => {
                  handleItemAutofill({ id, title, price_retail, image, description })
                  setItemList([])
                  setShowItems(false)
              }} />
              }

              {itemValue.id && 
                <button onClick={(e) => handlePlusItem(e)}><PlusIco fill="green" transform='scale(1)' baseProfile='tiny' width={24}/></button>
              }

            </div>
           <section className='itemsforoffer'>

              <table className='table table-striped table-sm offer'>
                <thead>
                  <tr>
                    <th class="col-1">Позиция</th>
                    <th class="col-4">Название</th>
                    <th class="col-1">Цена</th>
                    <th class="col-1">Закупочная цена</th>
                    <th class="col-1">Кол-во</th>
                    <th class="col-1">Сумма</th>
                    <th scope="col">Изображение</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
              {list.map((item, index) => {
                return(
                <tr 
                    key={index}
                    data-position={index}
                    draggable
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onDragLeave={onDragLeave}
                    className={dragAndDrop && dragAndDrop.draggedTo=== Number(index) ? "dropArea" : ""}
                  >
                  <td>{index+1}:</td>
                  <td class="col-4">{item.title}</td>
                  <td class="col-1"><input value={item.price} className="form-control my-3" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'price', e)} /></td>
                  <td class="col-1"><input value={item.purchase_price} className="form-control my-3" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'purchase_price', e)} /></td>
                  <td><input value={item.quantity} className="form-control my-3" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'quantity', e)} /></td>
                  <td>{item.price * item.quantity}</td>
                  <td><img src={item.image} height="100"></img></td>
                  <td className="col-1"><button onClick={(e) => deleteItemOffer(index, e)}><DeleteIco fill="red"/></button></td>
                  <i class="fas fa-arrows-alt-v"></i>
                </tr>
                )
              })}
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><b>Итого:</b></td>
                <td><b></b></td>
                <td></td>
                <td></td>
              </table>
              
           </section>
           </div>
           
          <button onClick={(e) => handlePostCLiсk(e)} className="w-50 btn btn-medium btn-primary mt-3">Опубликовать</button>
      </form>
  );
};

export default OfferForm;