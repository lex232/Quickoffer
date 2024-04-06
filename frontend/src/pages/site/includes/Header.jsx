import React from 'react';
import { useLocation } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/Headers.css';
import logo from '../../../static/image/logo.png';
import activeUrl from '../../../utils/activeUrl';

const Header = ({ loginstate, onSignOut, user }) => {

  const location = useLocation();
  const pathname = location.pathname;
  const active_url = "nav-link active"
  const non_active_url = "nav-link"

 // Подсветка активной ссылки
 const check_url_header = new activeUrl(pathname, active_url, non_active_url)

  
  function handleLogoutCLiсk(e) {
    // Обработать клик выхода

    e.preventDefault();
    onSignOut()
  }
  
  const NonAuthUser = () => {  
    return (
      <li className="nav-item"><a href="/login" className="nav-link link-dark px-2">Войти</a></li>
    )
  }

  const AuthUser = () => {
    let username = user.username
    return (
      <div>
        <li className="nav-item dark py-2">{username}</li>
        <li className="nav-item"> <button onClick={(e) => handleLogoutCLiсk(e)} className="nav-link link-dark px-2">Выйти</button></li>
      </div>
    )
  }

  const HeaderAuthOption = () => {
    if (loginstate === false) {
      return (
        NonAuthUser()
      )
    } else if (loginstate === true) {
      return (
        AuthUser()
      )
    }
  }

  return (
    <div className="container">
    <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <img className="bi text-muted flex-shrink-0 me-3" width="64" src={logo} alt=""/>
        <span className="fs-4">Быстрое КП</span>
      </a>

      <ul className="nav nav-pills">
        <li className="nav-item"><a href="/" className={check_url_header.check_absolute_url("/")} aria-current="page">Главная</a></li>
      </ul>
      <ul className="nav">
        <HeaderAuthOption />
      </ul>
    </header>
  </div>
  );
};

export default Header;