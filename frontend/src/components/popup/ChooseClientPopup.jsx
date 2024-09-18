import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../../css/popup.css'

import clients_api from '../../api/clients_api';

const ChooseClientPopup = ({ action, text }) => {
    /**
     * Popup окно выбора клиента
     */

    const [ clients, setClients ] = useState([]);
    const [ clientArea, setClientArea ] = useState({
        id: null,
        title: ''
      })

    // Показывать ли div с результатами поиска клиентов?
    const [ showClients, setShowClients ] = useState(false)

    useEffect(() => {
    // Получить всех клиентов при смене типа клиента
    getClients();
    }, []);

    const getClients = () => {
    clients_api.getClients({
    })
    .then(res => {
        setClients(res.results);
    })
    .catch((e) => console.log(e))
    }

    const handleChangeClient = ( id, title ) => {
        // Заполнение параметров клиента при выборе
        setClientArea({
          id,
          title
        })
        localStorage.setItem("nameclient", JSON.stringify({
            title: title,
            id: id
        }));
    }

    // UseEffect для динамического поиска клиентов
    // useEffect(_ => {
    //   if (clientValue.title === '') {
    //     return setClientList([])
    //   }
    //   clients_api
    //     .findClient({ client: clientValue.title })
    //     .then(clientsitems => {
    //       setClientList(clientsitems)
    //     })
    // }, [clientValue.title])

    {/* <div className="form-group">
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
    </div> */}

     {/* {showClients && clientList.length > 0 && <ClientsSearch
              clients={clientList}
              onClick={({ id, title }) => {
                handleClientAutofill({ id, title })
                setClientList([])
                setShowClients(false)
            }}/>
            } */}

    return (
        <div>
            <Popup  
                trigger={<span className="btn btn-primary btn">{text}</span>}
                modal
                contentStyle={{width: "350px", className: "modal"}}
                nested
            >
                {close => (
                    <div className="modal-dialog">
                        <div className="modal-dialog">
                            <div className="modal-content d-flex">
                                <div className="modal-header border-bottom-0 ">
                                    <h1 className="modal-title fs-4 mx-auto">{text}</h1>
                                </div>
                                <div className="d-flex">
                                    <p className="mx-auto mb-1 pb-1 pt-2 mt-2"><Link to="/profile/clients/create" className=''><span className='px-2'>Создайте нового</span><span className='position-absolute end-0'></span></Link>или</p>
                                </div>
                                <div className="d-flex">
                                    <p className="mx-auto">Выберите из выпадающего списка:</p>
                                </div>
                                <div className="pb-4 px-4">
                                    {clients && <div>
                                        <select name='selectSF' className='form-select w-100 border-input' aria-label='Выбор клиента' id="floatingSelectClient" onChange={(e) => handleChangeClient( e.target.value, e.target[e.target.selectedIndex].textContent)}>
                                            <option value=''>---</option>
                                            {clients.map((catList) => {
                                                return (
                                                    <option value={catList.id}>{catList.title}</option>
                                                )
                                            })}
                                        </select>
                                    </div>}
                                </div>
                                <div className="modal-footer border-top-0 mx-auto">
                                        <button type="button" className="btn btn-lg btn-primary "
                                                onClick={() => {
                                                    action({
                                                        id: clientArea.id,
                                                        title: clientArea.title
                                                    });
                                                    close();
                                                }}> Выбрать
                                            </button>
                                        <button className="btn btn-lg btn-light ms-3"
                                            onClick={() => {
                                                close();
                                            }}>
                                                Отмена
                                        </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    );
};

export default ChooseClientPopup;

