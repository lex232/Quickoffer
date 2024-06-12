import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Link, useLocation } from "react-router-dom";

import activeUrl from '../../../utils/activeUrl';

import { Box, Book, Users, Layers, Grid, Minus, ChevronRight, ChevronDown } from 'react-feather'
import './styles.css'


const ProfileSidebar = () => {

  const location = useLocation();
  const pathname = location.pathname;
  const active_url = "nav-link active text-purple"
  const non_active_url = "nav-link text-white"

  // Подсветка активной ссылки (Создаем класс)
  const check_url = new activeUrl(pathname, active_url, non_active_url)


  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block sidebar sidebar-custom collapse">
    
      <div className="position-sticky sidebar-sticky">

        <div className="sidebar-heading d-flex align-items-center px-3 mt-4 mb-1 fw-bold text-muted item-sidebar-custom" data-bs-toggle="collapse" data-bs-target="#general-collapse" aria-expanded="false">
                <Box /><span className='px-2'>Основное</span><span className='position-absolute end-0'><ChevronRight className='right-chevron'/></span>
        </div>
        <div className="collapse" id="general-collapse">
            <ul className="nav flex-column item-min-sidebar">
                <li className="nav-item">
                    <Link to="" className={check_url.check_absolute_url("/profile")} aria-current="page">
                    <span className="align-text-bottom text-start"><Minus size={15}/> Главная</span>
                    </Link>
                </li>
            </ul>
        </div>

        <div className="sidebar-heading d-flex align-items-center px-3 mt-2 mb-1 fw-bold text-muted item-sidebar-custom" data-bs-toggle="collapse" data-bs-target="#offer-collapse" aria-expanded="false">
                <Book /><span className='px-2'>КП</span><span className='position-absolute end-0'><ChevronRight className='right-chevron'/></span>
        </div>
        <div className="collapse" id="offer-collapse">
            <ul className="nav flex-column mb-2 item-min-sidebar">
                <li className="nav-item">
                    <Link to="offer/create" className={check_url.check_active("offer/create")} aria-current="page"> 
                        <span className="align-text-bottom text-start"><Minus size={15}/> Создать</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="offer/list" className={check_url.check_active("offer/list")} aria-current="page"> 
                        <span className="align-text-bottom"><Minus size={15}/> Посмотреть</span>
                    </Link>
                </li>
            </ul>
        </div>

        <div className="sidebar-heading d-flex align-items-center px-3 mt-2 mb-1 fw-bold text-muted item-sidebar-custom" data-bs-toggle="collapse" data-bs-target="#items-collapse" aria-expanded='false'>
          <Layers /><span className='px-2'>Товары/ услуги</span><span className='position-absolute end-0'><ChevronRight className='right-chevron'/></span>
        </div>
        <div className="collapse" id="items-collapse">
            <ul className="nav flex-column mb-2 item-min-sidebar">
                <li className="nav-item">
                    <Link to="items/create" className={check_url.check_active("items/create")} aria-current="page"> 
                        <span className="align-text-bottom"><Minus size={15}/> Создать</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="items/list" className={check_url.check_active("items/list")} aria-current="page"> 
                        <span className="align-text-bottom"><Minus size={15}/> Список</span>
                    </Link>
                </li>
            </ul>
        </div>

        <div className="sidebar-heading d-flex align-items-center px-3 mt-2 mb-1 fw-bold text-muted item-sidebar-custom" data-bs-toggle="collapse" data-bs-target="#clients-collapse" aria-expanded="false">
          <Users /><span className='px-2'>Клиенты</span><span className='position-absolute end-0'><ChevronRight className='right-chevron'/></span>
        </div>
        <div className="collapse" id="clients-collapse">
            <ul className="nav flex-column mb-2 item-min-sidebar">
                <li className="nav-item">
                    <Link to="clients/create" className={check_url.check_active("clients/create")} aria-current="page"> 
                        <span className="align-text-bottom"><Minus size={15}/> Создать</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="clients/list" className={check_url.check_active("clients/list")} aria-current="page"> 
                        <span className="align-text-bottom"><Minus size={15}/> Список</span>
                    </Link>
                </li>
            </ul>
        </div>

        <div className="sidebar-heading d-flex align-items-center px-3 mt-2 mb-1 fw-bold text-muted item-sidebar-custom" data-bs-toggle="collapse" data-bs-target="#settings-collapse" aria-expanded="false">
          <Grid /><span className='px-2'>Мой профиль</span><span className='position-absolute end-0'><ChevronRight className='right-chevron'/></span>
        </div>
        <div className="collapse" id="settings-collapse">
            <ul className="nav flex-column mb-2 item-min-sidebar">
                <li className="nav-item">
                    <Link to="my-organization/edit" className={check_url.check_active("my-organization/edit")} aria-current="page"> 
                        <span className="align-text-bottom"><Minus size={15}/> Реквизиты</span>
                    </Link>
                </li>
            </ul>
        </div>

      </div>
    </nav>
  );
};

export default ProfileSidebar;