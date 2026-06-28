import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { Helmet } from 'react-helmet-async';

import main_page_api from '../../../api/main_page_api';
import './style.css'
import Header from '../includes/Header.jsx';
import Footer from '../includes/Footer.jsx';
import MyClients from '../../../static/image/mainpage/my_clients_min.png';
import MyItem from '../../../static/image/mainpage/my_items_min.png';
import MyOffers from '../../../static/image/mainpage/my_offers.png';
import Catalog from '../../../static/image/mainpage/catalog.png';
import Note1000 from '../../../static/image/mainpage/note-800wobrand.png';
import Buy from '../../../static/image/mainpage/buy.jpg';
import { DownloadCloud, Clipboard, PieChart, BarChart, Camera, Lock, Globe, Zap, List, Layers } from 'react-feather';

const MainPage = ({ loginstate, onSignOut, user }) => {
  const [info, setInfo] = useState([]);

  const getAdmin = () => {
    main_page_api.getMainPageInfo()
      .then(res => setInfo(res))
      .catch(e => console.log(e));
  };

  useEffect(() => {
    getAdmin();
  }, []);

  return (
    <div className="main-page">
      <Helmet>
        <title>OfferGuru - создание коммерческих предложений быстро и просто</title>
        <meta name="description" content="Онлайн приложение для быстрого создания коммерческих предложений в сфере СКС, электрики, видеонаблюдения и тд." />
      </Helmet>

      <header className="container-fluid px-0">
        <Header loginstate={loginstate} onSignOut={onSignOut} user={user} />
      </header>

      <main>

        {/* ===== HERO ===== */}
        <section id="hero" className="hero-section">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 hero-content">
                <div className="hero-badge text-white">
                  <Zap size={14} />
                  Для монтажников и проектировщиков
                </div>
                <h1 className="hero-title text-white mb-3">
                  Создай КП,<br />которое продает!
                </h1>
                <p className="hero-subtitle text-white mb-4">
                  Автоматизируй весь пакет документов — от коммерческого предложения до счета и договора. Быстро, просто, на объекте.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <a href="/catalog" className="btn btn-light px-4 py-2 rounded-pill fw-semibold">
                    Посмотреть каталог
                  </a>
                  <a href="/registration" className="btn btn-outline-light px-4 py-2 rounded-pill">
                    Начать бесплатно
                  </a>
                </div>
              </div>
              <div className="col-lg-6 hero-image-wrapper">
                <img className="img-fluid" src={Note1000} alt="OfferGuru на ноутбуке" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section id="CTA" className="cta-modern section-padding-sm">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="cta-card text-center text-white">
                  <div className="position-relative" style={{ zIndex: 1 }}>
                    <h2 className="text-white mb-3 fw-bold" style={{ fontSize: '1.75rem' }}>
                      Найдите нужный товар/услугу за пару кликов
                    </h2>
                    <p className="text-white opacity-75 mb-4" style={{ fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 1.5rem' }}>
                      Большой каталог товаров: больше не придется создавать тысячи наименований для одного КП — всё в одном месте.
                    </p>
                    <a href="/catalog" className="btn btn-light fw-semibold">
                      Посмотреть каталог
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HELLO / ABOUT ===== */}
        <section id="hello" className="hello-section section-padding">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 text-center">
                <h2 className="section-title">Сервис от практикующих монтажников</h2>
                <div className="line-divider" style={{ width: '60px', height: '3px', background: '#009bd9', margin: '0 auto 20px' }}></div>
                <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
                  OfferGuru — сервис для быстрого создания коммерческого предложения. Можно сделать даже на объекте и не заставлять клиента ждать
                </p>
                <img className="img-fluid img-rounded" src={Buy} alt="" style={{ maxWidth: '90%' }} />
              </div>
              <div className="col-lg-6">
                <div className="ps-lg-4">
                  <div className="feature-list-item">
                    <div className="feature-icon">
                      <DownloadCloud size={24} />
                    </div>
                    <div className="feature-text">
                      <h5>Мгновенный расчет на объекте</h5>
                      <p>Позволяет быстро посчитать прямо на объекте, не откладывая на потом</p>
                    </div>
                  </div>
                  <div className="feature-list-item">
                    <div className="feature-icon">
                      <Clipboard size={24} />
                    </div>
                    <div className="feature-text">
                      <h5>Полный пакет документов</h5>
                      <p>Сформирует КП, договор, Торг-12 и счет — всё в одном месте</p>
                    </div>
                  </div>
                  <div className="feature-list-item">
                    <div className="feature-icon">
                      <BarChart size={24} />
                    </div>
                    <div className="feature-text">
                      <h5>Контроль прибыли</h5>
                      <p>Автоматический подсчет прибыли с каждого объекта</p>
                    </div>
                  </div>
                  <div className="feature-list-item">
                    <div className="feature-icon">
                      <PieChart size={24} />
                    </div>
                    <div className="feature-text">
                      <h5>Аналитика по объектам</h5>
                      <p>Статусы объектов для полного контроля и аналитики</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTORS ===== */}
        <section id="activity" className="sectors-section section-padding">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title">Для каких сфер применимо?</h2>
              <p className="section-subtitle">Мы охватываем основные направления в сфере монтажа и проектирования</p>
            </div>
            <div className="row g-4 justify-content-center">
              <div className="col-lg-3 col-md-6">
                <div className="sector-card">
                  <div>
                    <div className="sector-icon"><Zap size={22} /></div>
                    <h5>Электрика</h5>
                    <p>Розетки, кабели, автоматы, щиты</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="sector-card">
                  <div>
                    <div className="sector-icon"><Camera size={22} /></div>
                    <h5>Видеонаблюдение</h5>
                    <p>Камеры, регистраторы DVR, разъемы</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="sector-card">
                  <div>
                    <div className="sector-icon"><Lock size={22} /></div>
                    <h5>Контроль доступа</h5>
                    <p>СКУД контроллеры, считыватели, замки</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="sector-card">
                  <div>
                    <div className="sector-icon"><Globe size={22} /></div>
                    <h5>СКС</h5>
                    <p>Коммутаторы, стойки, оптика</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section id="feautures" className="features-section section-padding-sm">
          <div className="container">
            <div className="text-center mb-4">
              <h2 className="section-title">Считай быстро и эффективно</h2>
              <p className="section-subtitle">Большая база товаров с актуальными ценами позволит экономить много времени на просчет решений для клиента</p>
            </div>

            <div className="feature-row row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0">
                <img src={MyClients} className="img-fluid img-rounded-sm shadow" alt="" />
              </div>
              <div className="col-md-6">
                <div className="feature-content ps-md-4">
                  <h3>Личная база клиентов</h3>
                  <p>Создавай своих клиентов в один клик. Привязывай к ним коммерческие предложения, храни историю сделок, телефоны и контакты. Больше не нужно держать всё в голове или искать по блокнотам — вся база всегда под рукой в личном кабинете.</p>
                </div>
              </div>
            </div>

            <div className="feature-row row align-items-center flex-md-row-reverse">
              <div className="col-md-6 mb-3 mb-md-0">
                <img src={MyItem} className="img-fluid img-rounded-sm shadow" alt="" />
              </div>
              <div className="col-md-6">
                <div className="feature-content pe-md-4">
                  <h3>Нет товара в нашей базе?</h3>
                  <p>Не беда — создай свой собственный товар или услугу за пару минут. Добавь фото, описание, цены закупки и розницы. Твои товары видны только тебе — полная приватность. А если захочешь, можно поделиться товаром с командой.</p>
                </div>
              </div>
            </div>

            <div className="feature-row row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0">
                <img src={Catalog} className="img-fluid img-rounded-sm shadow" alt="" />
              </div>
              <div className="col-md-6">
                <div className="feature-content ps-md-4">
                  <h3>Готовый каталог товаров</h3>
                  <p>Добавляй товары из готовой базы в пару кликов. В каталоге уже собраны популярные позиции по электрике, видеонаблюдению, СКС и контролю доступа с актуальными ценами. База регулярно пополняется и обновляется.</p>
                </div>
              </div>
            </div>

            <div className="feature-row row align-items-center flex-md-row-reverse">
              <div className="col-md-6 mb-3 mb-md-0">
                <img src={MyOffers} className="img-fluid img-rounded-sm shadow" alt="" />
              </div>
              <div className="col-md-6">
                <div className="feature-content pe-md-4">
                  <h3>Ваши КП всегда под рукой</h3>
                  <p>Все созданные коммерческие предложения хранятся в личном кабинете. Можно в любой момент открыть, отредактировать цены или количество позиций и заново скачать документы. Никаких потерянных файлов — вся история сделок в одном месте.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DOCUMENTS ===== */}
        <section id="documents" className="documents-section section-padding">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title">Какие документы можно сформировать?</h2>
              <p className="section-subtitle">Полный комплект документов для закрытия сделки</p>
            </div>
            <div className="row g-4 justify-content-center">
              <div className="col-lg-3 col-md-6 col-6">
                <div className="doc-card">
                  <div className="doc-icon"><List size={20} /></div>
                  <div>
                    <h5>КП</h5>
                    <p>С подробным описанием и без</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-6">
                <div className="doc-card">
                  <div className="doc-icon"><Clipboard size={20} /></div>
                  <div>
                    <h5>Договор</h5>
                    <p>На услуги и работы</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-6">
                <div className="doc-card">
                  <div className="doc-icon"><Layers size={20} /></div>
                  <div>
                    <h5>Торг-12</h5>
                    <p>Накладная по стандарту</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-6">
                <div className="doc-card">
                  <div className="doc-icon"><Globe size={20} /></div>
                  <div>
                    <h5>Счет</h5>
                    <p>Предоплата и оплата</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS ===== */}
        <section id="counters" className="stats-section">
          <div className="container text-center position-relative" style={{ zIndex: 1 }}>
            <div className="stats-intro mb-2">
              <h2>Мы в цифрах</h2>
              <p>Не забываем каждое КП и каждого пользователя</p>
            </div>
            <div className="row g-4 justify-content-center">
              <div className="col-12 col-sm-4">
                <div className="stat-item">
                  <h3><CountUp end={info.count_clients} enableScrollSpy={true} scrollSpyOnce={true} separator="" /></h3>
                  <p>Пользователей</p>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="stat-item">
                  <h3><CountUp end={info.count_items} enableScrollSpy={true} scrollSpyOnce={true} separator="" /></h3>
                  <p>Товаров в базе</p>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="stat-item">
                  <h3><CountUp end={info.count_offers} enableScrollSpy={true} scrollSpyOnce={true} separator="" /></h3>
                  <p>Коммерческих предложений</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="container-fluid px-0">
        <Footer />
      </footer>
    </div>
  );
};

export default MainPage;
