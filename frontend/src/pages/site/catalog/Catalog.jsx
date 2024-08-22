import React, { useEffect, useState } from 'react';

import Header from '../includes/Header.jsx';
import Footer from '../includes/Footer.jsx';
import ItemsArea from '../items-area/ItemsArea.jsx';

import group_api from '../../../api/group_api';
import { AlignJustify, XCircle, Menu } from 'react-feather';
import './styles.css'


const CatalogPage = ({ loginstate, onSignOut, user }) => {
    /**
    * Страница каталога
    */

    const [ listGroups, setListGroups ] = useState([])
    const [ isLoaddingCat, setIsLoaddingCat ] = useState(true)
    const [ choosenCategory, setChoosenCategory ] = useState(undefined)
    const [ choosenTree, setChoosenTree ] = useState(undefined)
    const [ choosenTitle, setChoosenTitle ] = useState(undefined)

    const style_visible = "col-md-3 col-lg-2 d-md-block sidebar sidebar-custom collapse"
    const style_non_visible = "col-md-3 col-lg-2 d-md-block sidebar sidebar-custom"

    const [ isCollapsed, setIsCollapsed] = useState(style_visible)

    useEffect(() => {
        // Получить все новости при загрузке страницы
        getGroups();
      }, [])
      ;

    const getGroups = () => {
        // Получить список категорий товаров
        group_api.getItemsGroup()
        .then(res => {
          setListGroups(res);
          setChoosenCategory(res[0].id)
          setChoosenTitle(res[0].title)
        })
        .catch((e) => console.log(e))
        .finally(()=> setIsLoaddingCat(false))
      }

    const handleChangeCategory = (e, id, tree_id, title) => {
    // Устанавливаем значение типа компании onChange
        e.preventDefault();
        setChoosenCategory(id);
        setChoosenTree(tree_id);
        setChoosenTitle(title)
    }

    const handleMenu = (e) => {
    // Прячет меню
        e.preventDefault();
        if (isCollapsed === style_visible) {
            setIsCollapsed(style_non_visible)
        }
        else {setIsCollapsed(style_visible)}
    }


    return (
            <div>
                <div className="container-fluid">
                    <Header loginstate={loginstate} onSignOut={onSignOut} user={user}/>
                </div>
                <div className="d-flex">
                    {isLoaddingCat && <div className="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Загрузка...</span>
                    </div>}
                </div>
                <div className="container-fluid">
                <div className="row">
                    <div>
                        <button className='button-on-mobile ps-3 pb-2' onClick={(e) => handleMenu(e)}>
                            {style_visible === isCollapsed ? <><AlignJustify /> показать категории</> : <><XCircle /> скрыть категории</>}
                        </button>
                    </div>
                    <nav id="sidebarMenu" className={isCollapsed}>
                        <div className="position-sticky pt-3 sidebar-sticky mb-2">
                            <h3 className='header-category'><Menu /> Категории</h3>
                            <ul className="nav nav-pills flex-column gap-2">
                                {listGroups.map((results) => {
                                    return (
                                            results.level === 0 
                                            &&
                                            <div className="sidebar-heading d-flex align-items-center fw-bold text-muted item-sidebar-catalog px-3" data-bs-toggle="collapse" data-bs-target="#general-collapse" aria-expanded="false">
                                                <span className='position-absolute end-0'></span>
                                                <button onClick={(e) => handleChangeCategory(e, results.id, results.tree_id, results.title)}>
                                                    {results.id === choosenCategory ? <li className="nav-link active text-sidebar button-mini">{results.title}</li> : <li className="nav-item text-sidebar">{results.title}</li>}
                                                </button> 
                                            </div>
                                            ||
                                            choosenTree === results.tree_id && results.level !== 0
                                            &&
                                            <button onClick={(e) => handleChangeCategory(e, results.id, results.tree_id, results.title)}>
                                            {results.id === choosenCategory ? <li className="nav-link active small-item button-mini"> --- {results.title}</li> : <li className="nav-item small-item"> --- {results.title}</li>}
                                        </button>
                                        );
                                    })}
                            </ul>
                        </div>
                    </nav>
                    {choosenCategory && <ItemsArea category_id={choosenCategory} loginstate={loginstate} title={choosenTitle}/>}
                
                </div>
                </div>
                
                <div className="container-fluid">
                    <Footer/>
                </div>
                
            </div>
      );
    };
    
    export default CatalogPage;