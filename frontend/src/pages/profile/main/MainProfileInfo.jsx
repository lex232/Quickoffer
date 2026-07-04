import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import profile_page_api from '../../../api/profile_page_api';
import './admincard.css';

import { Users, Book, Layers, Grid, Server } from 'react-feather'

const cards = [
  {
    to: '/catalog',
    icon: Server,
    label: 'Каталог товаров',
    count: null,
    color: 'violet',
  },
  {
    to: 'clients/list',
    icon: Users,
    label: 'Мои клиенты',
    countKey: 'count_clients',
    color: 'blue',
  },
  {
    to: 'offer/list',
    icon: Book,
    label: 'Коммерческих предложений',
    countKey: 'count_offers',
    color: 'green',
  },
  {
    to: 'items/list',
    icon: Layers,
    label: 'Мои товары / услуги',
    countKey: 'count_items',
    color: 'orange',
  },
  {
    to: 'my-organization/edit',
    icon: Grid,
    label: 'Мои реквизиты',
    count: null,
    color: 'red',
  },
];

const MainAdminInfo = () => {
    const [info, setInfo] = useState(null);

    useEffect(() => {
        profile_page_api.getMainProfileInfo()
        .then(res => setInfo(res))
        .catch(e => console.log(e))
    }, []);

    return (
        <div className="dashboard-cards">
            {cards.map(card => {
                const Icon = card.icon;
                const count = card.countKey ? info?.[card.countKey] : card.count;
                return (
                    <Link key={card.to} to={card.to} className={`dash-card dash-card--${card.color}`}>
                        <div className="dash-card-icon">
                            <Icon size={28} />
                        </div>
                        <div className="dash-card-body">
                            {count !== null && <span className="dash-card-count">{count}</span>}
                            <span className={`dash-card-label ${count !== null ? '' : 'dash-card-label--standalone'}`}>{card.label}</span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default MainAdminInfo;
