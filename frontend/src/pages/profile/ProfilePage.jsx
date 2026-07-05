import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Header from '../site/includes/Header.jsx';
import ProfileSidebar from './sidebar/ProfileSidebar.jsx';

import { Outlet } from 'react-router-dom';
import { AlignJustify, X } from 'react-feather';
import './styles.css'

const MainProfile = ({ loginstate, onSignOut, user }) => {

  const [sidebarOpen, setSidebarOpen] = useState(() => window.matchMedia('(min-width: 768px)').matches);

  return (
    <div className="profile-layout">
      <Helmet>
        <title>OfferGuru - личный кабинет</title>
        <meta name="description" content="Личный кабинет сервиса OfferGuru" />
      </Helmet>

      <div className="header-wrap">
        <Header loginstate={loginstate} onSignOut={onSignOut} user={user} />
      </div>

      <div className="profile-body-wrap">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(prev => !prev)}>
          {sidebarOpen ? <X size={18} /> : <AlignJustify size={18} />}
        </button>

        <ProfileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="profile-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainProfile;
