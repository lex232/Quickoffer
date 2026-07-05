import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { AlertTriangle, X } from 'react-feather';
import './popup.css'

const DeletePopup = ({ InputIcon, color, name, action, id }) => {
    return (
        <Popup
            trigger={<button className="action-btn action-btn--danger"><InputIcon color={color} size={18} /></button>}
            modal
            nested
            closeOnDocumentClick
            contentStyle={{ width: 'auto', maxWidth: 380, padding: 0, border: 'none', borderRadius: 16 }}
        >
            {close => (
                <div className="delete-popup">
                    <button className="delete-popup-close" onClick={close}><X size={18} /></button>
                    <div className="delete-popup-icon">
                        <AlertTriangle size={32} color="#e53e3e" />
                    </div>
                    <h3 className="delete-popup-title">Удаление записи</h3>
                    <p className="delete-popup-text">Вы действительно хотите удалить?</p>
                    <p className="delete-popup-name">{name}</p>
                    <div className="delete-popup-actions">
                        <button
                            className="delete-popup-btn delete-popup-btn--danger"
                            onClick={() => { action(id); close(); }}
                        >
                            Удалить
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

export default DeletePopup;
