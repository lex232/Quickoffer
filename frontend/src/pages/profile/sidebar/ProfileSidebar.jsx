import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from "react-router-dom";

import activeUrl from '../../../utils/activeUrl';

import { ReactComponent as DeviceIco } from '../../../static/image/icons/device-laptop.svg'
import { ReactComponent as DocumentIco } from '../../../static/image/icons/document.svg'

const ProfileSidebar = () => {

  const location = useLocation();
  const pathname = location.pathname;
  const active_url = "nav-link active bg-dark text-white"
  const non_active_url = "nav-link"

  // Подсветка активной ссылки (Создаем класс)
  const check_url = new activeUrl(pathname, active_url, non_active_url)


  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3 sidebar-sticky">
        <h6 className="sidebar-heading d-flex align-items-center px-3 mt-4 mb-1 fw-bold text-muted text-uppercase">
            <DeviceIco fill="gray"/><span className='px-2'>Основное</span>
        </h6>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="" className={check_url.check_absolute_url("/admin")} aria-current="page">
                    <span className="align-text-bottom"></span>
                        Главная
                    </Link>
                </li>
            </ul>

        <h6 className="sidebar-heading d-flex align-items-center px-3 mt-2 mb-1 fw-bold text-muted text-uppercase">
          <DocumentIco fill="gray"/><span className='px-2'>КП</span>
        </h6>
            <ul className="nav flex-column mb-2">
                <li className="nav-item">
                    <Link to="createoffer" className={check_url.check_active("createoffer")} aria-current="page"> 
                        <span className="align-text-bottom">Создать</span>
                    </Link>
                </li>
            </ul>
            <ul className="nav flex-column mb-2">
                <li className="nav-item">
                    <Link to="listoffer" className={check_url.check_active("listoffer")} aria-current="page"> 
                        <span className="align-text-bottom">Посмотреть</span>
                    </Link>
                </li>
            </ul>
        <h6 className="sidebar-heading d-flex align-items-center px-3 mt-2 mb-1 fw-bold text-muted text-uppercase">
          <DocumentIco fill="gray"/><span className='px-2'>Товары</span>
        </h6>
            <ul className="nav flex-column mb-2">
                <li className="nav-item">
                    <Link to="createitem" className={check_url.check_active("createitem")} aria-current="page"> 
                        <span className="align-text-bottom">Создать</span>
                    </Link>
                </li>
            </ul>
            <ul className="nav flex-column mb-2">
                <li className="nav-item">
                    <Link to="listitem" className={check_url.check_active("listitem")} aria-current="page"> 
                        <span className="align-text-bottom">Посмотреть</span>
                    </Link>
                </li>
            </ul>

        <h6 className="sidebar-heading d-flex align-items-center px-3 mt-2 mb-1 fw-bold text-muted text-uppercase">
          <DocumentIco fill="gray"/><span className='px-2'>Клиенты</span>
        </h6>
            <ul className="nav flex-column mb-2">
                <li className="nav-item">
                    <Link to="statdownload" className={check_url.check_active("statdownload")} aria-current="page"> 
                        <span className="align-text-bottom">Создать</span>
                    </Link>
                </li>
            </ul>
            <ul className="nav flex-column mb-2">
                <li className="nav-item">
                    <Link to="envsettings" className={check_url.check_active("envsettings")} aria-current="page"> 
                        <span className="align-text-bottom">Посмотреть</span>
                    </Link>
                </li>
            </ul>
      </div>
    </nav>
  );
};

export default ProfileSidebar;