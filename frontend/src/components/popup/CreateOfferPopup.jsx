import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { AlertTriangle, PlusSquare } from 'react-feather'

const CreateOfferPopup = ({ action }) => {
    return (
        <Popup
            trigger={<button className='btn-create' type="button"><PlusSquare size={16} className='me-2' />Создать КП</button>}
            modal
            nested
            contentStyle={{ width: 'auto', maxWidth: 380, padding: 0, border: 'none', borderRadius: 16 }}
        >
            {close => (
                <div className="delete-popup">
                    <div className="delete-popup-icon">
                        <AlertTriangle size={32} color="#e53e3e" />
                    </div>
                    <h3 className="delete-popup-title">Черновик будет удалён</h3>
                    <p className="delete-popup-text">Вы уже редактируете другое КП. Создание нового удалит текущий черновик.</p>
                    <div className="delete-popup-actions">
                        <button
                            className="delete-popup-btn delete-popup-btn--danger"
                            onClick={(e) => { action(e); close(); }}
                        >
                            Продолжить
                        </button>
                        <button
                            className="delete-popup-btn delete-popup-btn--cancel"
                            onClick={close}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}
        </Popup>
    );
};

export default CreateOfferPopup;
