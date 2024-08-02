import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/popup.css'

const SimplePopup = ({ refPopup, heading, text }) => {
    
    return (
        <div>
           <Popup ref={refPopup} contentStyle={{width: "350px", className: "modal"}}>
           {close => (
                    <div className="modal-dialog">
                        <div className="modal-dialog">
                            <div className="modal-content d-flex">
                                <div className="d-flex py-2">
                                    <p className="mx-auto fs-5">{heading}</p>
                                </div>
                                <br></br>
                                <div className="d-flex px-4">
                                    <p className="fs-6 mx-auto no-white-space">
                                       {text}
                                    </p>
                                </div>
                                <div className="modal-footer flex-column border-top-0">
                                    <div className="actions">
                                        <button
                                            className="btn btn-lg btn-light w-100 mx-0 mt-2 mb-4"
                                            onClick={() => {
                                                close()
                                            }}>
                                                Закрыть окно
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }

            </Popup>
        </div>
    );
};

export default SimplePopup;
