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

  const items = [
    { number: "100", title: "Камера"},
    { number: "200", title: "Блок питания"},
    { number: "300", title: "Кабель"},
    { number: "400", title: "Разъем"},
    { number: "500", title: "Регистратор"},
  ]

  const initialDnDState = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: []
   }

  const DragToReorderList = () => {
    
    const [list, setList] = React.useState(items);
    const [dragAndDrop, setDragAndDrop] = React.useState(initialDnDState);
    
    
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
    
    // Not needed, just for logging purposes:
    useEffect( ()=>{
     console.log("Dragged From: ", dragAndDrop && dragAndDrop.draggedFrom);
     console.log("Dropping Into: ", dragAndDrop && dragAndDrop.draggedTo);
    }, [dragAndDrop])

    const deleteItemOffer = async (e) => {
      // Устанавливаем slug категории на событии onChange
      e.preventDefault();
      await items.pop()
      console.log('delete', items)

      await setList(items)
      console.log(list)
    }
    
    useEffect( ()=>{
     console.log("List updated!");
    }, [list])
    
       return(
           <section className='itemsforoffer'>
              <table className='table table-striped table-sm offer'>
                <thead>
                  <tr>
                    <th scope="col-1">Позиция</th>
                    <th scope="col">Название</th>
                    <th scope="col">Цена</th>
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
                  <td>{item.number}</td>
                  <td>{item.number}</td>
                  <td>{item.number}</td>
                  <td className="col-1"><button onClick={(e) => deleteItemOffer(e)}><DeleteIco fill="red"/></button></td>
                  <i class="fas fa-arrows-alt-v"></i>
                </tr>
                )
              })}
                
              </table>
           </section>
           )
   };
  

  const handleChangeName = (e) => {
    // Устанавливаем имя категории на событии onChange
    setName(e.target.value);
  }

  const handleChangeSlug = (e) => {
    // Устанавливаем slug категории на событии onChange
    setSlug(e.target.value);
  }

  const HandlePlusItem = (e) => {
    // Устанавливаем slug категории на событии onChange
    e.preventDefault();
    console.log('added')
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
            <input type="header" defaultValue={name_offer} className="form-control my-3" id="floatingInput" placeholder="Название КП" onChange={(e) => handleChangeName(e)} /> 
          </div>
          <div className="form">
            <input type="header" defaultValue={name_client} className="form-control my-3" id="floatingInput" placeholder="Клиент. Начните вводить текст для поиска" onChange={(e) => handleChangeSlug(e)} />
          </div>
          <div>
            <button onClick={(e) => HandlePlusItem(e)}><PlusIco fill="green" transform='scale(1)' baseProfile='tiny' width={24}/></button>
            <span className='ps-2'>Добавить товар/ услугу</span>
          </div>
          <DragToReorderList />
          <button onClick={(e) => handlePostCLiсk(e)} className="w-50 btn btn-medium btn-primary mt-3">Опубликовать</button>
          
      </form>
  );
};

export default OfferForm;