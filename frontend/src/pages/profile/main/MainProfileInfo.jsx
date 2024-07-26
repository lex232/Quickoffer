import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

import profile_page_api from '../../../api/profile_page_api';
import './admincard.css';

import { ReactComponent as UsersIco } from '../../../static/image/iconsadmin/address-card.svg'
import { ReactComponent as FileIco } from '../../../static/image/iconsadmin/file.svg'
import { ReactComponent as ItemIco } from '../../../static/image/iconsadmin/hdd.svg'
import { Tool, Users, Book, Layers, Grid } from 'react-feather'

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
                            <div class="card-body-move">
                                <div class="display-4 text-primary mb-2">
                                    <Users size={42} className='me-2' />
                                </div>
                                <h2 class="card-title mb-3">{info.count_clients}</h2>
                                <p class="card-text text-muted"><Link to="clients/list"><div className="font-weight-bold text-primary mb-3">Мои клиенты:</div></Link></p>
                            </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card card-move h-100 text-center shadow">
                        <div class="card-body-move">
                            <div class="display-4 text-success mb-2">
                                <Book size={42} className='me-2' />
                            </div>
                            <h2 class="card-title mb-3">{info.count_offers}</h2>
                            <p class="card-text text-muted"><Link to="offer/list"><div className="font-weight-bold text-primary mb-3">Коммерческих предложений:</div></Link></p>
                        </div>
                    </div>
                </div>   
                <div class="col">
                    <div class="card card-move h-100 text-center shadow">
                        <div class="card-body-move">
                            <div class="display-4 text-warning mb-2">
                                <Layers size={42} className='me-2' />
                            </div>
                            <h2 class="card-title mb-3">{info.count_items}</h2>
                            <p class="card-text text-muted"><Link to="items/list"><div className="font-weight-bold text-primary mb-3">Созданных товаров/ услуг:</div></Link></p>
                        </div>
                    </div>
                </div>  
                <div class="col">
                    <div class="card card-move h-100 text-center shadow">
                        <div class="card-body-move">
                            <div class="display-4 text-danger mb-2">
                                <Grid size={42} className='me-2' />
                            </div>
                            <h2 class="card-title mb-3"></h2>
                            <p class="card-text text-muted"><Link to="my-organization/edit"><div className="font-weight-bold text-primary mb-3">Мои реквизиты:</div></Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainAdminInfo;