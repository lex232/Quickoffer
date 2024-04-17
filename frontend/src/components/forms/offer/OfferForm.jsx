import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import items_api from '../../../api/items_api';

import { ReactComponent as PlusIco } from '../../../static/image/icons/plus-square.svg'
import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'
import './styles.css'

const OfferForm = ({
  id,
  name_offer,
  name_client,
  status_type
}) => {
  const navigate = useNavigate()
  const [ name_area, setName ] = useState(name_offer)
  const [ slug_area, setSlug ] = useState(name_client)


  const DragToReorderList = () => {
    
    const items = [
      { title: "Камера", price: "8990", purchase_price: "5990", quantity: "4"},
      { title: "Блок питания", price: "510", purchase_price: "370", quantity: "1"},
      { title: "Кабель", price: "27", purchase_price: "22", quantity: "80"},
      { title: "Разъем", price: "25", purchase_price: "15", quantity: "8"},
      { title: "Регистратор", price: "4790", purchase_price: "3590", quantity: "1"},
    ]

    const initialDnDState = {
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
      originalOrder: [],
      updatedOrder: []
     }
  

    const [list, setList] = useState(items);
    const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);
    
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
    
    // // Not needed, just for logging purposes:
    // useEffect( ()=>{
    //  console.log("Dragged From: ", dragAndDrop && dragAndDrop.draggedFrom);
    //  console.log("Dropping Into: ", dragAndDrop && dragAndDrop.draggedTo);
    // }, [dragAndDrop])

    const deleteItemOffer = (index, e) => {
      // Удаляем элемент в список товаров/услуг
      e.preventDefault();

      let prepareToDeleteList = list;
      delete prepareToDeleteList[index]
      setList(prepareToDeleteList);

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

      let prepareToDeleteList = list;
      prepareToDeleteList.push({ title: "Новый товар", price: "100", purchase_price: "60", quantity: "1"})
      setList(prepareToDeleteList);

      setDragAndDrop({
       ...dragAndDrop,
       draggedFrom: null,
       draggedTo: null,
       isDragging: false
      });
    }

    const handleChangeValue = (index, key, new_value, e) => {
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
    }
    
    useEffect( ()=>{
     console.log("Drag updated!", dragAndDrop);
    }, [list], [dragAndDrop])
    
       return(
          <div>
            <div>
              <button onClick={(e) => handlePlusItem(e)}><PlusIco fill="green" transform='scale(1)' baseProfile='tiny' width={24}/></button>
              <span className='ps-2'>Добавить товар/ услугу</span>
            </div>
           <section className='itemsforoffer'>

              <table className='table table-striped table-sm offer'>
                <thead>
                  <tr>
                    <th scope="col-1">Позиция</th>
                    <th scope="col">Название</th>
                    <th scope="col">Цена</th>
                    <th scope="col">Закупочная цена</th>
                    <th scope="col">Кол-во</th>
                    <th scope="col">Сумма</th>
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
                  <td>{item.title}:</td>
                  <td><input value={item.price} className="form-control my-3" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'price', item.price, e)} /></td>
                  <td><input value={item.purchase_price} className="form-control my-3" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'purchase_price', item.purchase_price, e)} /></td>
                  <td><input value={item.quantity} className="form-control my-3" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'quantity', item.quantity, e)} /></td>
                  <td>{item.price * item.quantity}</td>
                  <td className="col-1"><button onClick={(e) => deleteItemOffer(index, e)}><DeleteIco fill="red"/></button></td>
                  <i class="fas fa-arrows-alt-v"></i>
                </tr>
                )
              })}
                
              </table>
           </section>
           </div>
           )
   };
  

  const handleChangeName = (e) => {
    // Устанавливаем имя категории на событии onChange
    e.preventDefault();
    setName(e.target.value);
  }

  const handleChangeSlug = (e) => {
    // Устанавливаем slug категории на событии onChange
    e.preventDefault();
    setSlug(e.target.value);
  }

  function handlePostCLiсk(e) {
    // Обработать клик
    e.preventDefault();

    const data = {
      title: name_area,
      slug: slug_area,
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
            <input type="header" defaultValue={name_client} className="form-control my-3" id="offerClient" placeholder="Клиент. Начните вводить текст для поиска" onChange={(e) => handleChangeSlug(e)} />
          </div>
          <DragToReorderList />
          <button onClick={(e) => handlePostCLiсk(e)} className="w-50 btn btn-medium btn-primary mt-3">Опубликовать</button>
      </form>
  );
};

export default OfferForm;