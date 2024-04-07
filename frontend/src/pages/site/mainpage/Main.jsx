import React from 'react';

import styles from './style.module.css'
import Header from '../includes/Header.jsx';
import Footer from '../includes/Footer.jsx';

const MainPage = ({ loginstate, onSignOut, user }) => {

    return (
            <div>
                <div className="mx-auto py-4">
                    <Header loginstate={loginstate} onSignOut={onSignOut} user={user}/>
                </div>
                <div className="container px4">
                    <div className="row">
                        <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
                            <div class="col-md-6 p-lg-5 mx-auto my-5">
                            <h1 class="display-5 fw-bold">Создай КП, которое продает!</h1>
                            <h3 class="fw-normal text-muted mb-3">и автоматизирует весь пакет документов</h3>
                            <div class="d-flex gap-3 justify-content-center lead fw-normal">
                                <a class="icon-link" href="#">
                                узнать больше
                                <svg class="bi">sd</svg>
                                </a>
                                <a class="icon-link" href="#">
                                тарифы
                                <svg class="bi">sd</svg>
                                </a>
                            </div>
                            </div>
                            <div class="product-device shadow-sm d-none d-md-block"></div>
                            <div class="product-device product-device-2 shadow-sm d-none d-md-block"></div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto py-4">
                    <Footer/>
                </div>
            </div>
      );
    };
    
    export default MainPage;