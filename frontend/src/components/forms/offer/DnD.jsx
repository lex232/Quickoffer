const items = [
    { number: "1", title: "Камера"},
    { number: "2", title: "Блок питания"},
    { number: "3", title: "Кабель"},
    { number: "4", title: "Разъем"},
    { number: "5", title: "Регистратор"},
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
   
   
    onDragLeave = () => {
      setDragAndDrop({
      ...dragAndDrop,
      draggedTo: null
     });
     
    }
    
    // Not needed, just for logging purposes:
    React.useEffect( ()=>{
     console.log("Dragged From: ", dragAndDrop && dragAndDrop.draggedFrom);
     console.log("Dropping Into: ", dragAndDrop && dragAndDrop.draggedTo);
    }, [dragAndDrop])
    
    React.useEffect( ()=>{
     console.log("List updated!");
    }, [list])
    
       return(
           <section>
      <ul>
       
       {list.map( (item, index) => {
        return(
         <li 
          key={index}
          
          data-position={index}
          draggable
          
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          
          onDragLeave={onDragLeave}
          
          className={dragAndDrop && dragAndDrop.draggedTo=== Number(index) ? "dropArea" : ""}
          >
           <span>{item.number}</span>
           <p>{item.title}</p>
           <i class="fas fa-arrows-alt-v"></i>
         </li>
        )
       })}
        
      </ul>
           </section>
           )
   };
   
   ReactDOM.render(
     <DragToReorderList />,
     document.getElementById("root")
   );
   