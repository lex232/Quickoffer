import React, { useEffect, useState} from 'react';
import { useLocation, Link } from 'react-router-dom';

import '../../../css/Headers.css';
import logo from '../../../static/image/logo.png';
import activeUrl from '../../../utils/activeUrl';

import './styles.css'

const Header = ({ loginstate, onSignOut, user }) => {
  /**
  * Шапка сайта
  */

  const location = useLocation();
  const pathname = location.pathname;
  const active_url = "nav-link active text-black"
  const non_active_url = "nav-link text-black"

  let items = []

  // Сохраняем корзину в локальное хранилище
  if (localStorage.getItem("items")) {
      items = JSON.parse(localStorage.getItem("items"));
  }
  
  // Динамическая проверка элементов корзины, чтобы сразу отобразить в хэдере
  const [ item_length, setItemLength ] = useState(items.length)
  window.addEventListener('storage', () => {
    if (localStorage.getItem("items")) {
      items = JSON.parse(localStorage.getItem("items"));
    }
    setItemLength(items.length)
  })

 // Подсветка активной ссылки
 const check_url_header = new activeUrl(pathname, active_url, non_active_url)

 useEffect(() => {

}, [localStorage.getItem("items")])
  
  function handleLogoutCLiсk(e) {
    // Обработать клик выхода
    e.preventDefault();
    onSignOut()
  }
  
  const NonAuthUser = () => {
    /**
    * Меню не авторизованного пользователя
    */
    
    return (
      <div className='nav'>
        {/* <li className="nav-item"><a href="/" className={check_url_header.check_absolute_url("about")} aria-current="page">О проекте</a></li> */}
        <li className="nav-item"><a href="/login" className="nav-link link-dark px-2 text-black">Войти</a></li>
        <li className="nav-item"><a href="/registration" className="nav-link link-dark px-2 text-black">Регистрация</a></li>
      </div>
    )
  }

  const AuthUser = () => {
    /**
    * Меню авторизованного пользователя
    */

    let username = user.username
    return (
      <div className='nav'>
        <li className="nav-item py-2 position-relative me-3">
          {item_length > 0 && <div><Link to="/profile/offer/create" className='nav-item dark py-2 text-black text-decoration-none'>Корзина КП</Link>
            <div className='circle-number position-absolute top-0 start-100 translate-middle'>{item_length}</div>
          </div>
          }
        </li>
          <li className="nav-item "><Link to="/profile"><div className="nav-item dark py-2 text-black text-decoration-none">Личный кабинет</div></Link></li>
          <li className="nav-item"> <button onClick={(e) => handleLogoutCLiсk(e)} className="nav-link link-dark px-3">Выйти</button></li>
      </div>
    )
  }

  const HeaderAuthOption = () => {
    /**
    * Определяет авторизацию
    */
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
    <div className="container-fluid px-3">
      <header className="d-flex flex-wrap justify-content-center py-3">
        <a href={loginstate ? "/profile" : "/"} className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
          <img className="bi text-muted flex-shrink-0" width="200" src={logo} alt=""/>
        </a>
        <ul className="nav nav-pills">
          <HeaderAuthOption />
        </ul>
      </header>
    </div>
  );
};

export default Header;