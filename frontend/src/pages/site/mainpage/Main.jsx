import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';

import main_page_api from '../../../api/main_page_api';
import './style.css'
import Header from '../includes/Header.jsx';
import Footer from '../includes/Footer.jsx';
import MyClients from '../../../static/image/mainpage/my_clients_min.png';
import MyItem from '../../../static/image/mainpage/my_items_min.png';
import MyOffers from '../../../static/image/mainpage/my_offers_min.jpg';
import Note1000 from '../../../static/image/mainpage/note-800.png';
import Buy from '../../../static/image/mainpage/buy.jpg';
import { DownloadCloud, Clipboard, PieChart, BarChart } from 'react-feather';

const MainPage = ({ loginstate, onSignOut, user }) => {
    /**
    * Главная страница
    */
    const [info, setInfo] = useState([]);

    const getAdmin = () => {
        main_page_api.getMainPageInfo()
        .then(res => {
          setInfo(res);
        })
        .catch((e) => console.log(e))
    }

    useEffect(() => {
        // Получить данные из БД для главной страницы
        getAdmin();
      }, [])
      ;

    return (
            <body>
                <header className="container-fluid">
                    <Header loginstate={loginstate} onSignOut={onSignOut} user={user}/>
                </header>
                <main className="container-fluid">

                    <section id="after-header">
                        <div class="container">
                            <div className="row">
                                <div className="position-relative overflow-hidden pt-5 mt-3 text-center">
                                    <div className="col-md-6 mx-auto ">
                                        <h1 className="display-6 fw-bold">Создай КП, которое продает!</h1>
                                        <h3 className="fw-normal text-muted mb-3">и автоматизирует весь пакет документов</h3>
                                        <div className="d-flex gap-3 justify-content-center lead fw-normal">
                                            {/* <a className="icon-link text-white text-decoration-none" href="#">узнать больше<NextIco fill="white" width="24px" height="24px" className="mx-auto"/></a> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        <div class="row">
                            <div class="col-xs-10 col-xs-offset-1">
                                <img class="img-responsive" src={Note1000} alt=""></img>
                            </div>
                        </div>
                        </div>
                    </section>

                    <section id="hello">
                            <div class="container">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <h2 className='section-title mt-2'>Сервис от практикующих
                                        <br></br>монтажников</h2>
                                    </div>
                                    <div class="col-xs-6 col-sm-12 col-xs-offset-3 col-sm-offset-0 col-md-5 col-lg-6">
                                        <img class="img-responsive center-block" src={Buy} alt=""></img>
                                    </div>
                                    <div class="col-xs-12 col-lg-6 align-items-start">
                                        <ul>
                                            <li className='li-no-style text-start d-flex'>
                                                <div class="circle col-auto"><DownloadCloud className='circle-ico' size='40'/></div>
                                                <div className='my-auto'>Позволяет быстро посчитать прямо на объекте</div>
                                            </li>
                                            <li className='li-no-style text-start d-flex'>
                                                <div class="circle col-auto"><Clipboard className='circle-ico' size='40'/><img src="" alt=""></img></div>
                                                <div className='my-auto'>Сформирует основные типы документов</div>
                                            </li>
                                            <li className='li-no-style text-start d-flex'>
                                                <div class="circle col-auto"><BarChart className='circle-ico' size='40'/><img src="" alt=""></img></div>
                                                <div className='my-auto'>Подсчет прибыли с объекта</div>
                                            </li>
                                            <li className='li-no-style text-start d-flex'>
                                                <div class="circle col-auto"><PieChart className='circle-ico' size='40'/><img src="" alt=""></img></div>
                                                <div className='my-auto'>Статусы объектов для аналитики</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                    <section id="feautures" className="feautures pb-4">
                        <div id="features" className="flex-split">
                            <div className="container-s">
                                <div className="align-center flex-intro">
                                    <h2 className='section-title mt-2'>Считай быстро и эффективно</h2>
                                    <div className='line-divider'></div>
                                    <p className='mb-5'> Большая база товаров с актуальными ценами позволит экономить много времени на просчет решений для клиента.</p>
                                </div>
                                <div class="row content">
                                    <div class="col-md-5" data-aos="fade-right">
                                        <img src={MyClients} class="img-fluid" alt=""></img>
                                    </div>
                                    <div class="col-md-7 pt-5 flex-intro" data-aos="fade-left ">
                                        <h3>Личная база клиентов.</h3>
                                        <p class="f-text">
                                            Создавай своих клиентов, чтобы привязывать к ним КП.
                                        </p>
                                    </div>
                                </div>
                                <div class="row content">
                                    <div class="col-md-5 order-1 order-md-2" data-aos="fade-left">
                                        <img src={MyItem} class="img-fluid" alt=""></img>
                                    </div>
                                    <div class="col-md-7 pt-5 order-2 order-md-1 flex-intro" data-aos="fade-right">
                                        <h3>Нет товара в нашей базе?.</h3>
                                        <p class="f-text">
                                            Легко создать свой, и дополнить базу. Ваш товар не увидет никто другой.
                                        </p>
                                    </div>
                                </div>
                                <div class="row content">
                                    <div class="col-md-5" data-aos="fade-right">
                                        <img src={MyOffers} class="img-fluid" alt=""></img>
                                    </div>
                                    <div class="col-md-7 pt-5 flex-intro" data-aos="fade-left ">
                                        <h3>Формируй документы.</h3>
                                        <p class="f-text">
                                            Скачай PDF счет или КП для отправки за пару кликов.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="counters" className="counters">
                        <div className="yd-stats wow fadeIn">
                            <div className="container-s">
                                <div className="row text-center">
                                <div className="col-sm-12">
                                    <div className="intro">
                                    <h2>Мы в цифрах</h2>
                                    <p>Не забываем каждое КП и каждого пользователя.</p>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="counter-up">
                                        <h3>
                                            <span className="counter"><CountUp end={info.count_clients} enableScrollSpy={true} scrollSpyOnce={true} separator=''></CountUp></span>
                                        </h3>
                                    <div className="counter-text">
                                        <h2>Пользователей</h2>
                                    </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="counter-up">
                                        <h3><span className="counter"><CountUp end={info.count_items} enableScrollSpy={true} scrollSpyOnce={true} separator=''></CountUp></span></h3>
                                    <div className="counter-text">
                                        <h2>Товаров в базе</h2>
                                    </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="counter-up">
                                        <h3><span className="counter"><CountUp end={info.count_offers} enableScrollSpy={true} scrollSpyOnce={true} separator=''></CountUp></span></h3>
                                    <div className="counter-text">
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