import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import profile_page_api from '../../../api/profile_page_api';
import './admincard.css';

import { Users, Book, Layers, Grid, Server } from 'react-feather'

const MainAdminInfo = () => {
    const [info, setInfo] = useState([]);

    const getAdmin = () => {
        profile_page_api.getMainProfileInfo()
        .then(res => {
          setInfo(res);
        })
        .catch((e) => console.log(e))
    }

    useEffect(() => {
        // Получить все новости при загрузке страницы
        getAdmin();
      }, [])
      ;

    return (
        <div classNameName="container-fluid">
            <div class="row row-cols-1 row-cols-md-4 g-4">
                <div class="col">
                    <div class="card card-move h-100 text-center shadow">
                        <Link to="/catalog"><div class="card-body-move">
                            <div class="display-4 decoration-color my-2">
                                <Server size={42} className='me-2' />
                            </div>
                            <p class="card-text text-muted"><div className="font-weight-bold text-primary mb-3">Каталог товаров</div></p>
                        </div></Link>
                    </div>
                </div>
                <div class="col">
                    <div class="card card-move h-100 text-center shadow">
                        <Link to="clients/list"><div class="card-body-move">
                            <div class="display-4 text-primary my-2">
                                <Users size={42} className='me-2' />
                            </div>
                            <p class="card-text text-muted"><div className="font-weight-bold text-primary mb-3">Мои клиенты {info.count_clients}</div></p>
                        </div></Link>
                    </div>
                </div>
                <div class="col">
                    <div class="card card-move h-100 text-center shadow">
                        <Link to="offer/list"><div class="card-body-move">
                            <div class="display-4 text-success my-2">
                                <Book size={42} className='me-2' />
                            </div>
                            <p class="card-text text-muted"><div className="font-weight-bold text-primary mb-3">Коммерческих предложений {info.count_offers}</div></p>
                        </div></Link>
                    </div>
                </div>   
                <div class="col">
                    <div class="card card-move h-100 text-center shadow">
                        <Link to="items/list"><div class="card-body-move">
                            <div class="display-4 text-warning my-2">
                                <Layers size={42} className='me-2' />
                            </div>
                            <p class="card-text text-muted"><div className="font-weight-bold text-primary mb-3">Мои товары/ услуги {info.count_items}</div></p>
                        </div></Link>
                    </div>
                </div>  
                <div class="col">
                    <div class="card card-move h-100 text-center shadow">
                        <Link to="my-organization/edit"><div class="card-body-move">
                            <div class="display-4 text-danger my-2">
                                <Grid size={42} className='me-2' />
                            </div>
                            <p class="card-text text-muted"><div className="font-weight-bold text-primary mb-3">Мои реквизиты:</div></p>
                        </div></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainAdminInfo;