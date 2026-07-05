import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LogOut, ShoppingBag } from 'react-feather';

import '../../../css/Headers.css';
import logo from '../../../static/image/logo.png';

import './styles.css'

const Header = ({ loginstate, onSignOut, user }) => {

  let items = []
  if (localStorage.getItem("items")) {
    items = JSON.parse(localStorage.getItem("items"));
  }

  const [itemLength, setItemLength] = useState(items.length)

  useEffect(() => {
    const handler = () => {
      let saved = []
      try { saved = JSON.parse(localStorage.getItem("items") || '[]') } catch { }
      setItemLength(saved.length)
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  function handleLogoutClick(e) {
    e.preventDefault();
    onSignOut()
  }

  const AuthUser = () => (
    <div className="header-nav">
      {itemLength > 0 && (
        <Link to="/profile/offer/create" className="header-link header-cart">
          <ShoppingBag size={18} />
          <span>КП</span>
          {itemLength > 0 && <span className="header-badge">{itemLength}</span>}
        </Link>
      )}
      <Link to="/profile" className="header-link">Личный кабинет</Link>
      <button onClick={handleLogoutClick} className="header-link header-link--logout" title="Выйти">
        <LogOut size={18} />
      </button>
    </div>
  )

  const NonAuthUser = () => (
    <div className="header-nav">
      <Link to="/login" className="header-link">Войти</Link>
      <Link to="/registration" className="header-btn">Регистрация</Link>
    </div>
  )

  return (
    <header className="header">
      <div className="header-inner">
        <a href={loginstate ? "/profile" : "/"} className="header-logo">
          <img src={logo} alt="OfferGuru" />
        </a>
        {loginstate === true ? <AuthUser /> : loginstate === false ? <NonAuthUser /> : null}
      </div>
    </header>
  );
};

export default Header;