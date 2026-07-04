import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";

import { Layout, Book, Layers, Users, Settings, ChevronRight, ShoppingBag } from 'react-feather'
import './styles.css'


const ProfileSidebar = ({ isOpen, onClose }) => {

  const location = useLocation();
  const pathname = location.pathname;

  const [settingsOpen, setSettingsOpen] = useState(false);

  const isActive = (pattern) => {
    if (pattern === '/profile') return pathname === '/profile';
    return pathname.includes(pattern);
  };

  const navItems = [
    { to: '/catalog', icon: ShoppingBag, label: 'Каталог', exact: false, match: '/catalog' },
    { to: '/profile', icon: Layout, label: 'Главный экран', exact: true, match: '/profile' },
    { to: '/profile/offer/list', icon: Book, label: 'Коммерческие предложения', match: 'offer/' },
    { to: '/profile/items/list', icon: Layers, label: 'Товары и услуги', match: 'items/' },
    { to: '/profile/clients/list', icon: Users, label: 'Клиенты', match: 'clients/' },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`profile-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-inner">
          <div className="sidebar-menu">
            {navItems.map(item => {
              const active = item.exact
                ? isActive(item.match)
                : isActive(item.match);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`sidebar-link ${active ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-section">
            <button
              className="sidebar-section-toggle"
              onClick={() => setSettingsOpen(prev => !prev)}
            >
              <Settings size={20} />
              <span>Мой профиль</span>
              <ChevronRight size={16} className={`chevron ${settingsOpen ? 'rotated' : ''}`} />
            </button>

            <div className={`sidebar-submenu ${settingsOpen ? 'open' : ''}`}>
              <Link
                to="/profile/my-organization/edit"
                className={`sidebar-sub-link ${isActive('my-organization/edit') ? 'active' : ''}`}
                onClick={onClose}
              >
                Реквизиты
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
