import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/popup.css'

import { ReactComponent as DeleteIco } from '../../static/image/icons/delete.svg'
import { ReactComponent as StatusOk} from '../../static/image/icons/tick.svg'


const SuccessFailedPopup = ({open, title, result, link_redirect}) => {

    const handleRedirect = () => {
        window.location.href = link_redirect;
    }
    
    const handleStay = () => {
        return null
    }

    return (
        <div>
            <Popup  
                open={open}
                modal
                contentStyle={{width: "350px", className: "modal"}}
                nested={true}
                onClose={result === true ? handleRedirect : handleStay}
            >
                {close => (
                    <div className="modal-dialog">
                        <div className="modal-dialog">
                            <div className="modal-content d-flex">
                                <div className="modal-header border-bottom-0 ">
                                    <h1 className="modal-title fs-6 mx-auto">Отправка формы на тему</h1>
                                    
                                </div>
                                <div className="d-flex py-2">
                                    <p className="mx-auto fs-5">"{title}"</p>
                                </div>
                                <div className="d-flex px-4">
                                    <p className="fs-6 mx-auto">
                                        {result === true ? <StatusOk transform='scale(3)' fill="green" className="mx-auto"/> : <DeleteIco transform='scale(3)' fill="red" className="mx-auto"/>}
                                        <br />
                                        {result === true ? "Отправлено успешно" : "Произошла ошибка. Попробуйте заполнить снова"}
                                    </p>
                                </div>
                                <div className="modal-footer flex-column border-top-0">
                                    <div className="actions">
                                        <button
                                            className="btn btn-lg btn-light w-100 mx-0 mt-2 mb-4"
                                            onClick={() => {
                                                {result === true ? handleRedirect() : close()}
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

export default SuccessFailedPopup;

