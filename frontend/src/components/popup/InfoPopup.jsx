import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/popup.css'

const InfoPopup = ({ text }) => {

    return (
        <div>
            <Popup
                // trigger={<button className="button"><InputIcon fill={color}/></button>}
                open
                modal
                contentStyle={{width: "350px", className: "modal"}}
            >
                {close => (
                    <div className="modal-dialog">
                        <div className="modal-dialog">
                            <div className="modal-content d-flex">
                                <div className="modal-header border-bottom-0 ">
                                    <h1 className="modal-title fs-4 mx-auto">Сообщение</h1>
                                    <button onClick={close} type="button btn-primary" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="d-flex pt-2">
                                    <p className="mx-auto">{text}</p>
                                </div>
                                <div className="d-flex px-4">
                                    <p className="fs-6 mx-auto">as</p>
                                </div>
                                <div className="modal-footer flex-column border-top-0">
                                    <div className="actions">
                                        <button
                                            className="btn btn-lg btn-light w-100 mx-0 mt-2 mb-4"
                                            onClick={() => {
                                                close();
                                            }}>
                                                Ок
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

export default InfoPopup;
