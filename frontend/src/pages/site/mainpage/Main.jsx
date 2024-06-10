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

                    <div id="features" class="flex-split">
                        <div class="container-s">
                            <div class="flex-intro align-center wow fadeIn">
                            <h2>Считай быстро и эффективно</h2>
                            <p> Большая база товаров с актуальными ценами позволит экономить много времени на просчет решений для клиента.</p>
                            </div>
                            <div class="flex-inner align-center">
                                <div class="f-image wow">
                                <img class="img-fluid" src="assets/images/feature.png" alt="Feature"></img>
                                </div>
                                <div class="f-text">
                                    <div class="left-content">
                                        <h2>Личная база клиентов.</h2>
                                        <p> Создавай своих клиентов, чтобы привязывать к ним КП.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="flex-inner flex-inverted align-center">
                                <div class="f-image f-image-inverted">
                                    <img class="img-fluid" src="assets/images/feature.png" alt="Feature"></img>
                                </div>
                                <div class="f-text">
                                    <div class="left-content">
                                    <h2>Нет товара в нашей базе?.</h2>
                                    <p> Легко создать свой, и дополнить базу. Ваш товар не увидет никто другой.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="flex-inner align-center">
                                <div class="f-image wow">
                                <img class="img-fluid" src="assets/images/feature.png" alt="Feature"></img>
                                </div>
                                <div class="f-text">
                                    <div class="left-content">
                                        <h2>Формируй документы.</h2>
                                        <p> Скачай PDF счет или КП для отправки за пару кликов</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        </div>


                        <div class="yd-stats wow fadeIn">
                        <div class="container-s">
                            <div class="row text-center">
                            <div class="col-sm-12">
                                <div class="intro">
                                <h2>Наши показатели</h2>
                                <p>Не забываем каждое КП и каждого пользователя.</p>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="counter-up">
                                    <h3><span class="counter">47</span>%</h3>
                                <div class="counter-text">
                                    <h2>Пользователей</h2>
                                </div>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="counter-up">
                                    <h3><span class="counter">33</span>%</h3>
                                <div class="counter-text">
                                    <h2>Товаров в базе</h2>
                                </div>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="counter-up">
                                    <h3><span class="counter">33</span>%</h3>
                                <div class="counter-text">
                                    <h2>Коммерческих предложений</h2>
                                </div>
                                </div>
                            </div>
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