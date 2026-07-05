import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import offer_api from '../../../api/offer_api';
import { Trash2, Minus, Plus, AlertTriangle, X } from 'react-feather'

import ChooseClientPopup from '../../popup/ChooseClientPopup';
import DiscountPopup from '../../popup/discountPopup';

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

  const [ fieldErrors, setFieldErrors ] = useState({})
  const [ touched, setTouched ] = useState({})

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

  const [ saving, setSaving ] = useState(false)
  const [ confirmDeleteIndex, setConfirmDeleteIndex ] = useState(null)
  const [ confirmClear, setConfirmClear ] = useState(false)
  const [ errorData, setErrorData ] = useState(null)

  // Итоговая стоимость КП
  const [ finallyPrice, setFinallyPrice ] = useState(0)
  const [ finallyPurchasePrice, setFinallyPurchasePrice ] = useState(0)

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
    calculateFinalPurchasePrice()
  }, [list])



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
    e.preventDefault();
    setConfirmDeleteIndex(index);
  }

  const confirmDelete = () => {
    if (confirmDeleteIndex === null) return;
    let prepareToDeleteList = list;
    prepareToDeleteList.splice(confirmDeleteIndex, 1)
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
    calculateFinalPurchasePrice()
    window.dispatchEvent(new Event("storage"));
    setConfirmDeleteIndex(null);
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
    list.map((item) => {
      temp_final += (item.item_price_retail * item.amount)
    })
    setFinallyPrice(Number(temp_final.toFixed(2)))
  }

  const isFieldInvalid = (key, value) => {
    if (!touched[key]) return false;
    if (key === 'amount') return !value || Number(value) < 1;
    return !value || Number(value) <= 0;
  }

  const calculateFinalPurchasePrice = () => {
    // Подсчет итого закупка
    let temp_final_purchase = 0
    list.map((item) => {
      temp_final_purchase += (item.item_price_purchase * item.amount)
    })
    setFinallyPurchasePrice(Number(temp_final_purchase.toFixed(2)))
  }

  const detectActionsWithItems = (itemsList, index, key, e, action, value) => {
    let temp_value = Number(itemsList[index][key])
    if (action === 'minus') {
      if (temp_value > 1) {
        itemsList[index][key] = temp_value - 1
      }
    }
    else if (action === 'plus') {
      itemsList[index][key] = temp_value + 1
    }
    else if (action === 'purchase_discount') {
      temp_value = Number(itemsList[index]['item_price_retail'])
      itemsList[index][key] = Number(temp_value - (temp_value * (value / 100))).toFixed(2)
    }
    else {
      let val = String(e.target.value).replace(/[^\d.]/g, '');
      val = val.replace(/(\..*)\./g, '$1');
      val = val.replace(/^(\d+\.\d{2}).*$/, '$1');
      itemsList[index][key] = val;
    }
    return itemsList
  }

  const handleChangeValue = (index, key, e, action, value) => {
    // Меняем в словаре значение количества
    // action - действие. Если null - берем значение из target.value
    e.preventDefault();
    let prepareToChangeList = list;
    prepareToChangeList = detectActionsWithItems(prepareToChangeList, index, key, e, action, value)
    setList(prepareToChangeList);
    localStorage.setItem("items", JSON.stringify(list));
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false
    });
    calculateFinalPrice();
    calculateFinalPurchasePrice()
    setTouched(prev => ({ ...prev, [index + '_' + key]: true }));
  }

  const handleChangeName = (e) => {
    setName(e.target.value);
    setTouched(prev => ({ ...prev, name: true }));
    if (e.target.value.trim()) {
      localStorage.setItem("nameoffer", e.target.value);
    } else {
      localStorage.removeItem("nameoffer");
    }
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



  async function handlePostCLiсk(edit, e) {
    e.preventDefault();

    const data = {
      title: nameArea,
      client: clientValue.id,
      status_type: 'in_edit',
      items_for_offer: list,
    }
    const errors = [];
    list.forEach((item, i) => {
      if (!item.item_price_retail || Number(item.item_price_retail) <= 0)
        errors.push({ index: i, field: 'item_price_retail', msg: `Позиция ${i+1}: укажите розничную цену` });
      if (!item.item_price_purchase || Number(item.item_price_purchase) <= 0)
        errors.push({ index: i, field: 'item_price_purchase', msg: `Позиция ${i+1}: укажите закупочную цену` });
      if (!item.amount || Number(item.amount) < 1)
        errors.push({ index: i, field: 'amount', msg: `Позиция ${i+1}: количество должно быть не менее 1` });
    });
    if (errors.length) {
      const allTouched = {};
      list.forEach((_, i) => {
        allTouched[i + '_item_price_retail'] = true;
        allTouched[i + '_item_price_purchase'] = true;
        allTouched[i + '_amount'] = true;
      });
      allTouched.name = true;
      setTouched(allTouched);
      setErrorData({ validation: errors.map(e => e.msg) });
      return;
    }

    setSaving(true)
    try {
      if (edit === false) {
        await offer_api.createOffer(data)
      } else if (edit === true) {
        data.id = editable
        await offer_api.updateOffer(data)
      }
      ClearOffer()
      navigate("/profile/offer/list")
    } catch (err) {
      setErrorData(typeof err === 'object' ? err : { detail: 'Ошибка соединения' });
    } finally {
      setSaving(false)
    }
  }

  return (
      <form>
        <div className="row mx-0 my-1 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Название КП* :</label>
                <input type="text" value={nameArea || ''}
                className={'form-control border-input' + (touched.name && !nameArea?.trim() ? ' is-invalid' : '')}
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
                <b> {clientValue.title} <button className='action-btn action-btn--danger' onClick={(e) => deleteCurrentClient(e)} title="Удалить"><Trash2 size={14} /></button> </b> :
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
                              <input value={item.item_price_retail} className={'form-control offer-min-form mb-1' + (isFieldInvalid(index + '_item_price_retail', item.item_price_retail) ? ' is-invalid' : '')} id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'item_price_retail', e)} />
                            </div>
                            <div className="col-6 col-lg-12 pb-2">
                              <label>Закупочная цена</label>
                              <div className='d-flex'>
                                <input value={item.item_price_purchase} className={'form-control offer-min-form' + (isFieldInvalid(index + '_item_price_purchase', item.item_price_purchase) ? ' is-invalid' : '')} id={index+1} placeholder="Цена закупки*" onChange={(e) => handleChangeValue(index, 'item_price_purchase', e)} />
                                <DiscountPopup text='Пересчитать от розничной цены' action={handleChangeValue} index={index} key_change='item_price_purchase'/>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 col-lg-4 col-xl-4 offer-text-min row m-0 p-0 pb-2">
                            <div className="col-5">
                              <label>Кол-во</label>
                                <div className='offer-qty'>
                                  <button className="cart-qty-btn" type="button" onClick={(e) => handleChangeValue(index, 'amount', e, 'minus')}><Minus size={13} /></button>
                                  <input value={item.amount} className={'form-control offer-min-form' + (isFieldInvalid(index + '_amount', item.amount) ? ' is-invalid' : '')} id={index+1} placeholder="Кол-во*" onChange={(e) => handleChangeValue(index, 'amount', e)} />
                                  <button className="cart-qty-btn" type="button" onClick={(e) => handleChangeValue(index, 'amount', e, 'plus')}><Plus size={13} /></button>
                                </div>
                            </div>
                            <div className="col-5">
                              <label>Итого</label>
                              <h5 className="mb-0 offer-total">{(item.item_price_retail * item.amount).toFixed(2)} Р</h5>
                            </div>
                            <div className="col-2 d-flex align-items-center">
                            <button className="action-btn action-btn--danger" onClick={(e) => deleteItemOffer(index, e)} title="Удалить"><Trash2 size={16} /></button>
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
               })}
              <Popup
                open={confirmDeleteIndex !== null}
                onClose={() => setConfirmDeleteIndex(null)}
                modal
                nested
                contentStyle={{ width: 400, padding: 0, border: 'none', borderRadius: 16 }}
              >
                <div className="delete-popup">
                  <button className="delete-popup-close" onClick={() => setConfirmDeleteIndex(null)}><X size={18} /></button>
                  <div className="delete-popup-icon">
                    <AlertTriangle size={32} color="#e53e3e" />
                  </div>
                  <h3 className="delete-popup-title">Удаление записи</h3>
                  <p className="delete-popup-text">Убрать из КП?</p>
                  <p className="delete-popup-name">{confirmDeleteIndex !== null ? list[confirmDeleteIndex]?.title : ''}</p>
                  <div className="delete-popup-actions">
                    <button
                      className="delete-popup-btn delete-popup-btn--danger"
                      onClick={confirmDelete}
                    >
                      Удалить
                    </button>
                    <button
                      className="delete-popup-btn delete-popup-btn--cancel"
                      onClick={() => setConfirmDeleteIndex(null)}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </Popup>

              <Popup
                open={errorData !== null}
                onClose={() => setErrorData(null)}
                modal
                nested
                contentStyle={{ width: 400, padding: 0, border: 'none', borderRadius: 16 }}
              >
                <div className="delete-popup">
                  <button className="delete-popup-close" onClick={() => setErrorData(null)}><X size={18} /></button>
                  <div className="delete-popup-icon">
                    <AlertTriangle size={32} color="#e53e3e" />
                  </div>
                  <h3 className="delete-popup-title">Ошибка сохранения</h3>
                  <div className="delete-popup-text" style={{ textAlign: 'left', marginBottom: 16 }}>
                    {(() => {
                      try {
                        if (!errorData || typeof errorData !== 'object') return <div>Ошибка сохранения</div>;
                        const msgs = [];
                        const extract = (obj) => {
                          if (typeof obj === 'string' && obj) msgs.push(obj);
                          else if (Array.isArray(obj)) obj.forEach(extract);
                          else if (obj && typeof obj === 'object') Object.values(obj).forEach(extract);
                        };
                        extract(errorData);
                        return msgs.length ? msgs.map((m, i) => <div key={i}>{m}</div>) : <div>Ошибка сохранения</div>;
                      } catch {
                        return <div>Ошибка сохранения</div>;
                      }
                    })()}
                  </div>
                  <div className="delete-popup-actions">
                    <button className="delete-popup-btn delete-popup-btn--cancel" onClick={() => setErrorData(null)}>
                      Закрыть
                    </button>
                  </div>
                </div>
              </Popup>

              <Popup
                open={confirmClear}
                onClose={() => setConfirmClear(false)}
                modal
                nested
                contentStyle={{ width: 'auto', maxWidth: 380, padding: 0, border: 'none', borderRadius: 16 }}
              >
                <div className="delete-popup">
                  <div className="delete-popup-icon">
                    <AlertTriangle size={32} color="#e53e3e" />
                  </div>
                  <h3 className="delete-popup-title">Очистить КП</h3>
                  <p className="delete-popup-text">Все добавленные позиции будут удалены. Продолжить?</p>
                  <div className="delete-popup-actions">
                    <button className="delete-popup-btn delete-popup-btn--danger" onClick={() => { ClearOffer(); setConfirmClear(false); }}>
                      Очистить
                    </button>
                    <button className="delete-popup-btn delete-popup-btn--cancel" onClick={() => setConfirmClear(false)}>
                      Отмена
                    </button>
                  </div>
                </div>
              </Popup>

              <div>
                <div className='pt-1'><b>Итого:</b></div>
                <div>Розница: <b>{finallyPrice.toFixed(2)} руб.</b></div>
                <div>Закупка: <b>{finallyPurchasePrice.toFixed(2)} руб.</b></div>
                <div className='pt-1'>Ваша прибыль: <b>{Number(finallyPrice-finallyPurchasePrice).toFixed(2)} руб.</b></div>
              </div>
           </section>
           </div>
           <div className="btn-toolbar d-flex align-items-end mb-4">
            <div className='justify-content-start col-12'>
              {editable ? <div className=''><button disabled={saving} onClick={(e) => handlePostCLiсk(false, e)} className="btn btn-primary mt-3 me-3 float-start">{saving ? 'Сохранение...' : 'Сохранить как новое КП'}</button> 
              <button disabled={saving} onClick={(e) => handlePostCLiсk(true, e)} className="btn btn-primary mt-3 float-start">{saving ? 'Сохранение...' : 'Перезаписать'}</button></div>
              : 
              <button disabled={saving} onClick={(e) => handlePostCLiсk(false, e)} className="btn btn-primary mt-3 float-start">{saving ? 'Сохранение...' : 'Опубликовать'}</button>}         
            </div>
            <div className='justify-content-end col-12 mt-2 pe-3'>
              <button onClick={() => setConfirmClear(true)} type="button" className="btn btn-outline-secondary float-end">Очистить КП</button>
            </div>
          </div>
      </form>
  );
};

export default OfferForm;