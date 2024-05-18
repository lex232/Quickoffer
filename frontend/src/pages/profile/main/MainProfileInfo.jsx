import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

import profile_page_api from '../../../api/profile_page_api';
import './admincard.css';

import { ReactComponent as UsersIco } from '../../../static/image/iconsadmin/address-card.svg'
import { ReactComponent as FileIco } from '../../../static/image/iconsadmin/file.svg'
import { ReactComponent as ItemIco } from '../../../static/image/iconsadmin/hdd.svg'

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
            <div className="row text-center pt-3">

                <div className="col-xl-4 col-md-6 mb-4 px-5">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <Link to="clients/list"><div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Мои клиенты:</div></Link>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{info.count_clients}</div>
                                </div>
                                <div className="col-auto">
                                    <UsersIco fill="#dddfeb" transform='scale(1)' baseProfile='tiny' width={42}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-md-6 mb-4 px-5">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <Link to="offer/list"><div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Коммерческих предложений:</div></Link>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{info.count_offers}</div>
                                </div>
                                <div className="col-auto">
                                    <FileIco fill="#dddfeb" transform='scale(0.9)' baseProfile='tiny' width={42}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-md-6 mb-4 px-5">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <Link to="items/list"><div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Созданных товаров/ услуг:</div></Link>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{info.count_items}</div>
                                </div>
                                <div className="col-auto">
                                    <ItemIco fill="#dddfeb" transform='scale(0.9)' baseProfile='tiny' width={42}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




            </div>
    );
};

export default MainAdminInfo;