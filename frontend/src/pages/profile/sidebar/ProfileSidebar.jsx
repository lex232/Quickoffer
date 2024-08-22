import React from 'react';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Link, useLocation } from "react-router-dom";

import activeUrl from '../../../utils/activeUrl';

import { Box, Book, Users, Layers, Grid, Minus, ChevronRight, ShoppingBag } from 'react-feather'
import './styles.css'


const ProfileSidebar = ({ styleCollapse }) => {

  const location = useLocation();
  const pathname = location.pathname;
  const active_url = "nav-link active text-white fw-bold"
  const non_active_url = "nav-link text-white"
  const active_url_main = "sidebar-heading d-flex align-items-center px-3 mt-1 mb-1 fw-bold text-muted item-sidebar-custom"
  const non_active_url_main = "sidebar-heading d-flex align-items-center px-3 mt-1 mb-1 text-muted item-sidebar-custom"

  // Подсветка активной ссылки (Создаем класс)
  const check_url = new activeUrl(pathname, active_url, non_active_url)
  const check_url_main = new activeUrl(pathname, active_url_main, non_active_url_main)


  return (
    <nav id="sidebarMenu" className={styleCollapse}>
    
      <div className="position-sticky sidebar-sticky pt-1 pb-3">
        <div >
            <Link to="/catalog" className={check_url_main.check_absolute_url("/catalog")}><ShoppingBag /><span className='px-2'>Каталог</span><span className='position-absolute end-0'></span></Link>
        </div>
        -------------
        <div >
            <Link to="/profile" className={check_url_main.check_absolute_url("/profile")}><Box /><span className='px-2'>Главный экран</span><span className='position-absolute end-0'></span></Link>
        </div>

        <div >
            <Link to="offer/list" className={check_url_main.check_active("offer/")}><Book /><span className='px-2'>КП</span><span className='position-absolute end-0'></span></Link>
        </div>
        
        <div>
            <Link to="items/list" className={check_url_main.check_active("items/")}><Layers /><span className='px-2'>Мои товары/ услуги</span><span className='position-absolute end-0'></span></Link>
        </div>

        <div>
            <Link to="clients/list" className={check_url_main.check_active("clients/")}><Users /><span className='px-2'>Клиенты</span><span className='position-absolute end-0'></span></Link>
        </div>
    
        <div className="sidebar-heading d-flex align-items-center px-3 mt-2 mb-1 text-muted item-sidebar-custom" data-bs-toggle="collapse" data-bs-target="#settings-collapse" aria-expanded="false">
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