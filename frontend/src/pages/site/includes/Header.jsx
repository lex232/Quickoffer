import React from 'react';
import { useLocation, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/Headers.css';
import logo from '../../../static/image/logo.png';
import activeUrl from '../../../utils/activeUrl';

import { ReactComponent as AuthIco } from '../../../static/image/iconsheader/user-lock.svg'
import { ReactComponent as UserIco } from '../../../static/image/iconsheader/user.svg'
import { ReactComponent as ExitIco } from '../../../static/image/iconsheader/lock-closed.svg'

const Header = ({ loginstate, onSignOut, user }) => {

  const location = useLocation();
  const pathname = location.pathname;
  const active_url = "nav-link active text-black"
  const non_active_url = "nav-link text-black"

 // Подсветка активной ссылки
 const check_url_header = new activeUrl(pathname, active_url, non_active_url)

  
  function handleLogoutCLiсk(e) {
    // Обработать клик выхода
    e.preventDefault();
    onSignOut()
  }
  
  const NonAuthUser = () => {  
    return (
      <li className="nav-item"><a href="/login" className="nav-link link-dark px-2 text-black"><AuthIco fill="black"  transform='scale(1)' baseProfile='tiny' width={16} className='me-2'/>Войти</a></li>
    )
  }

  const AuthUser = () => {
    let username = user.username
    return (
      <div>
        <Link to="/profile"><div className="nav-item dark py-2 text-black text-decoration-none"><UserIco fill="black"  transform='scale(1)' baseProfile='tiny' width={14} className='me-2'/>{username}</div></Link>
        <li className="nav-item"> <button onClick={(e) => handleLogoutCLiсk(e)} className="nav-link link-dark px-2"><ExitIco fill="black"  transform='scale(1)' baseProfile='tiny' width={20} className='me-2'/>Выйти</button></li>
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
    <div className="container-fluid">
    <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <img className="bi text-muted flex-shrink-0 ms-5" width="200" src={logo} alt=""/>
      </a>

      <ul className="nav nav-pills">
        <li className="nav-item"><a href="/" className={check_url_header.check_absolute_url("about")} aria-current="page">О проекте</a></li>
      </ul>
      <ul className="nav">
        <HeaderAuthOption />
      </ul>
    </header>
  </div>
  );
};

export default Header;