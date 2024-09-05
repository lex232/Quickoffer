import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../../css/popup.css'
import api from '../../api';


const postReport = async (title, question, subject, client_info) => {
    await api.createReport({ 
        title: title,
        question: question,
        subject: subject,
        client_info: client_info,
    })
      .then(res => {
        console.log(res)
      })
  }

const FeedBackPopup = ({ subject, loginstate }) => {
    const [ nameArea, setName ] = useState(undefined)
    const [ textArea, setText ] = useState(undefined)
    const client_info = 'example: 127.0.0.1';

    const handleChangeName = (e) => {
        // Устанавливаем имя записи на событии onChange
        setName(e.target.value);
      }
    
      const handleChangeText = (e) => {
        // Устанавливаем текст записи на событии onChange
        setText(e.target.value);
      }

    return (
        <div>
            <Popup  
                trigger={<button className="btn btn-md btn-primary w-100 mx-0 mt-2 mb-4">Оставить обращение</button>}
                modal
                contentStyle={{width: "450px", className: "modal"}}
                nested
            >
                {close => (
                    <div className="modal-dialog">
                        <div className="modal-dialog">
                            <div className="modal-content d-flex">
                                <div className="modal-header border-bottom-0 ">
                                    <h1 className="modal-title fs-4 mx-auto">Обратная связь</h1>
                                    <button onClick={close} type="button btn-primary" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="d-flex pt-2">
                                    <p className="mx-auto">Оставить вопрос или пожелание по теме {subject}</p>
                                </div>
                                <div className="form mx-3">
                                    <label for="floatingInput">Заголовок обращения</label>
                                    <input type="header" className="form-control my-3" id="floatingInput" placeholder="Название записи" onChange={(e) => handleChangeName(e)} /> 
                                </div>
                                <div className="form mx-3">
                                    <label for="floatingPassword">Текст обращения</label>
                                    <textarea type="text"className="form-control my-3" id="floatingPassword" placeholder="Текст" rows="5" onChange={(e) => handleChangeText(e)} />
                                </div>
                                <div className="modal-footer flex-column border-top-0">
                                    <div className="actions">
                                        {loginstate && <button 
                                            type="button"
                                            className="btn btn-md btn-primary w-100 mx-0 mb-2"
                                                onClick={() => {
                                                    postReport(nameArea, textArea, subject, client_info);
                                                    close();
                                                }}> Отправить
                                        </button>}
                                        {!loginstate && <a href="/login" className="btn btn-md btn-light w-100 mx-0 mt-2">Авторизуйтесь, чтобы отправить обращение</a>
                                        }
                                        <button
                                            className="btn btn-md btn-light w-100 mx-0 mt-2 mb-4"
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

export default FeedBackPopup;

