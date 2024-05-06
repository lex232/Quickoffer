import React, { useEffect, useState } from 'react';

import Header from '../includes/Header.jsx';
import Footer from '../includes/Footer.jsx';
import ItemsArea from '../items-area/ItemsArea.jsx';

import group_api from '../../../api/group_api';
import './styles.css'


const CatalogPage = ({ loginstate, onSignOut, user }) => {

    const [ listGroups, setListGroups ] = useState([])
    const [ isLoaddingCat, setIsLoaddingCat ] = useState(true)
    const [ choosenCategory, setChoosenCategory ] = useState(undefined)

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
        })
        .catch((e) => console.log(e))
        .finally(()=> setIsLoaddingCat(false))
      }

    const handleChangeCategory = (e, id) => {
    // Устанавливаем значение типа компании onChange
    e.preventDefault();
    setChoosenCategory(id);
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
                <div className="row g-3">
                    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block sidebar collapse">
                        <div className="position-sticky pt-3 sidebar-sticky">
                            <h2>Категории</h2>
                            <ul className="nav nav-pills flex-column gap-2">
                                {listGroups.map((results) => {
                                    return (
                                        <button onClick={(e) => handleChangeCategory(e, results.id)}>
                                            {results.id === choosenCategory ? <li className="nav-link active">{results.title}</li> : <li className="nav-item">{results.title}</li>}
                                        </button>
                                        );
                                    })}
                            </ul>
                        </div>
                    </nav>
                    {choosenCategory && <ItemsArea category_id={choosenCategory}/>}
                
                </div>
                </div>
                
                <div className="container-fluid">
                    <Footer/>
                </div>
                
            </div>
      );
    };
    
    export default CatalogPage;