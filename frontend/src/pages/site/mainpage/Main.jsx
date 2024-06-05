import React from 'react';

import './style.css'
import Header from '../includes/Header.jsx';
import Footer from '../includes/Footer.jsx';
import { ReactComponent as NextIco } from '../../../static/icons/main/next.svg'

const MainPage = ({ loginstate, onSignOut, user }) => {

    return (
            <body>
                <header className="container-fluid">
                    <Header loginstate={loginstate} onSignOut={onSignOut} user={user}/>
                </header>
                <main className="container-fluid">
                    <div className="row">
                        <div className="position-relative overflow-hidden pt-5 pb-5 mt-3 mb-3 text-center mainbackground">
                            <div className="col-md-6 p-lg-5 mx-auto my-5">
                                <h1 className="display-5 fw-bold">Создай КП, которое продает!</h1>
                                <h3 className="fw-normal text-muted mb-3">и автоматизирует весь пакет документов</h3>
                                <div className="d-flex gap-3 justify-content-center lead fw-normal">
                                    <a className="icon-link text-white text-decoration-none" href="#">узнать больше<NextIco fill="white" width="24px" height="24px" class="mx-auto"/></a>
                                    <a className="ms-2 icon-link text-white text-decoration-none" href="#">тарифы<NextIco fill="white" width="24px" height="24px" class="mx-auto"/></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section class="" >
                        <div class="container">
                        <div class="row">
                            <div class="col-sm-12 wow pulse">
                                <div class="title">
                                    <h2>Наши возможности<i class="fa fa-circle"></i></h2>
                                </div>
                            </div>
                            <div class="col-sm-12"> 
 
                            </div>
                        </div>
                        </div>
                    </section>

                </main>
                <footer classNameName="container-fluid">
                    <Footer/>
                </footer>
            </body>
      );
    };
    
    export default MainPage;