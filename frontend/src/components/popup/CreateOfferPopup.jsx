import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../../css/popup.css'
import { PlusSquare} from 'react-feather'

const CreateOfferPopup = ({ action }) => {
    /**
     * Popup окно создания нового КП (алерт если есть уже редактируемое)
     */

    return (
        <div>
            <Popup  
                trigger={<button className='btn btn-primary btn-create' type="button"><PlusSquare size={16} className='me-2' />Создать КП</button>}
                modal
                contentStyle={{width: "350px", className: "modal"}}
                nested
            >
                {close => (
                    <div className="modal-dialog">
                        <div className="modal-dialog">
                            <div className="modal-content d-flex">
                                <div className="modal-header border-bottom-0 ">
                                    <h1 className="modal-title fs-4 mx-auto">Создание нового КП</h1>
                                    <button onClick={close} type="button btn-primary" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="d-flex pt-2">
                                    <p className="mx-auto">Вы уже создаете/ редактируете КП. Подтверждение удалит добавленные позиции. Продолжить?</p>
                                </div>
                                <div className="modal-footer flex-column border-top-0">
                                    <div className="actions">
                                        <button 
                                            type="button"
                                            className="btn btn-lg btn-primary w-100 mx-0 mb-2"
                                                onClick={(e) => {
                                                    action(e);
                                                }}> Да
                                            </button>
                                        <button
                                            className="btn btn-lg btn-light w-100 mx-0 mt-2 mb-4"
                                            onClick={() => {
                                                close();
                                            }}>
                                                Отмена
                                        </button>
                                    </div>    
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    );
};

export default CreateOfferPopup;

