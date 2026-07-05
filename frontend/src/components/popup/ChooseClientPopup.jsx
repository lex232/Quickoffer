import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../../css/popup.css';
import './popup.css'

import { Search, Plus, X } from 'react-feather';
import clients_api from '../../api/clients_api';

const ChooseClientPopup = ({ action, text, className }) => {
    const [ clients, setClients ] = useState([]);
    const [ filteredClients, setFilteredClients ] = useState([]);
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ selectedId, setSelectedId ] = useState(null);
    const [ selectedTitle, setSelectedTitle ] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        getClients();
    }, []);

    const getClients = () => {
        clients_api.getClients({})
            .then(res => setClients(res.results))
            .catch(e => console.log(e));
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredClients(clients);
            return;
        }
        const q = searchQuery.toLowerCase();
        setFilteredClients(
            clients.filter(c => c.title.toLowerCase().includes(q))
        );
    }, [searchQuery, clients]);

    const handleSelect = (id, title) => {
        setSelectedId(id);
        setSelectedTitle(title);
    };

    const handleConfirm = (close) => {
        if (selectedId) {
            action({ id: selectedId, title: selectedTitle });
            localStorage.setItem("nameclient", JSON.stringify({
                title: selectedTitle,
                id: selectedId
            }));
        }
        close();
    };

    const handlePopupOpen = () => {
        setSearchQuery('');
        setSelectedId(null);
        setSelectedTitle('');
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    return (
        <Popup
            trigger={<span className={className || "btn btn-primary btn"}>{text}</span>}
            modal
            contentStyle={{width: "400px", padding: 0, borderRadius: "16px", border: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.12)"}}
            onOpen={handlePopupOpen}
            nested
        >
            {close => (
                <div className="choose-client-popup">
                    <button className="choose-client-close" onClick={() => close()}>
                        <X size={18} />
                    </button>

                    <div className="choose-client-header">
                        <h3>{text}</h3>
                        <p className="choose-client-subtitle">Выберите клиента из списка или создайте нового</p>
                    </div>

                    <div className="choose-client-search-wrap">
                        <Search size={16} className="choose-client-search-icon" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="choose-client-search"
                            placeholder="Поиск клиента..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="choose-client-list">
                        {filteredClients.length > 0 ? (
                            filteredClients.map(client => (
                                <button
                                    key={client.id}
                                    className={`choose-client-item ${selectedId === client.id ? 'active' : ''}`}
                                    onClick={() => handleSelect(client.id, client.title)}
                                >
                                    <span className="choose-client-item-title">{client.title}</span>
                                </button>
                            ))
                        ) : (
                            <div className="choose-client-empty">
                                <p>Клиенты не найдены</p>
                            </div>
                        )}
                    </div>

                    <div className="choose-client-footer">
                        <Link to="/profile/clients/create" className="choose-client-create-btn" onClick={() => close()}>
                            <Plus size={16} />
                            Создать нового клиента
                        </Link>
                        <div className="choose-client-footer-actions">
                            <button
                                className="choose-client-btn choose-client-btn--primary"
                                disabled={!selectedId}
                                onClick={() => handleConfirm(close)}
                            >
                                Выбрать
                            </button>
                            <button
                                className="choose-client-btn choose-client-btn--cancel"
                                onClick={() => close()}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Popup>
    );
};

export default ChooseClientPopup;
