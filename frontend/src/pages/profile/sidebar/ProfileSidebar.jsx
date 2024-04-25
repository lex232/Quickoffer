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
  const non_active_url = "nav-link text-black"

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
                    <Link to="" className={check_url.check_absolute_url("/profile")} aria-current="page">
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
                    <Link to="offer/create" className={check_url.check_active("offer/create")} aria-current="page"> 
                        <span className="align-text-bottom">Создать</span>
                    </Link>
                </li>
            </ul>
            <ul className="nav flex-column mb-2">
                <li className="nav-item">
                    <Link to="offer/list" className={check_url.check_active("offer/list")} aria-current="page"> 
                        <span className="align-text-bottom">Посмотреть</span>
                    </Link>
                </li>
            </ul>

        <h6 className="sidebar-heading d-flex align-items-center px-3 mt-2 mb-1 fw-bold text-muted text-uppercase">
          <DocumentIco fill="gray"/><span className='px-2'>Товары</span>
        </h6>
            <ul className="nav flex-column mb-2">
                <li className="nav-item">
                    <Link to="items/create" className={check_url.check_active("items/create")} aria-current="page"> 
                        <span className="align-text-bottom">Создать</span>
                    </Link>
                </li>
            </ul>


        <h6 className="sidebar-heading d-flex align-items-center px-3 mt-2 mb-1 fw-bold text-muted text-uppercase">
          <DocumentIco fill="gray"/><span className='px-2'>Клиенты</span>
        </h6>
            <ul className="nav flex-column mb-2">
                <li className="nav-item">
                    <Link to="clients/create" className={check_url.check_active("clients/create")} aria-current="page"> 
                        <span className="align-text-bottom">Создать</span>
                    </Link>
                </li>
            </ul>

        <h6 className="sidebar-heading d-flex align-items-center px-3 mt-2 mb-1 fw-bold text-muted text-uppercase">
          <DocumentIco fill="gray"/><span className='px-2'>Свои Реквизиты</span>
        </h6>
            <ul className="nav flex-column mb-2">
                <li className="nav-item">
                    <Link to="my-organization/edit" className={check_url.check_active("my-organization/edit")} aria-current="page"> 
                        <span className="align-text-bottom">Редактировать</span>
                    </Link>
                </li>
            </ul>

      </div>
    </nav>
  );
};

export default ProfileSidebar;