import React from 'react';
import Header from '../includes/Header.jsx';
import Footer from '../includes/Footer.jsx';
import './style.css'
import { Helmet } from 'react-helmet-async';


const CookiesPage = ({ loginstate, onSignOut, user }) => {
    return (
        <div className="privacy-page">
            <Helmet>
                <title>OfferGuru - Политика использования cookies</title>
                <meta name="description" content="Политика использования файлов cookie сервиса OfferGuru." />
            </Helmet>
            <Header loginstate={loginstate} onSignOut={onSignOut} user={user} />
            <main>
                <div className="row mb-3">
                    <div className="col privacy-content">
                        <div id="inputResult">
                            <div className="row mb-4">
                                <div className="col">
                                    <h4><strong>Политика использования файлов cookie</strong></h4>
                                </div>
                            </div>

                            <div className="row mb-4 text-start">
                                <div className="col">
                                    <h5>1. Что такое cookie</h5>
                                    <div className="descr">
                                        Файлы cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве (компьютере, планшете, смартфоне) при посещении веб-сайтов. Они позволяют сайту запоминать ваши действия и предпочтения на определённый период времени.
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 text-start">
                                <div className="col">
                                    <h5>2. Какие cookie мы используем</h5>
                                    <div className="ol">
                                        <div className="li">
                                            <strong>Технические (обязательные) cookie</strong> — необходимы для корректной работы Сервиса: авторизации, навигации по страницам, сохранения сессии. Без них использование Сервиса невозможно.
                                        </div>
                                        <div className="li">
                                            <strong>Функциональные cookie</strong> — запоминают ваши настройки и предпочтения (выбранный фильтр, язык интерфейса), чтобы вам не приходилось устанавливать их заново при каждом визите.
                                        </div>
                                        <div className="li">
                                            <strong>Аналитические cookie</strong> — собирают обезличенную статистику об использовании Сервиса: какие страницы наиболее популярны, как пользователи переходят между разделами. Эти данные помогают нам улучшать Сервис.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 text-start">
                                <div className="col">
                                    <h5>3. Срок хранения cookie</h5>
                                    <div className="ol">
                                        <div className="li">
                                            <strong>Сессионные cookie</strong> — удаляются автоматически после закрытия браузера.
                                        </div>
                                        <div className="li">
                                            <strong>Постоянные cookie</strong> — остаются на вашем устройстве до истечения срока их действия или до ручного удаления. Мы используем постоянные cookie для запоминания ваших предпочтений между визитами.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 text-start">
                                <div className="col">
                                    <h5>4. Управление cookie</h5>
                                    <div className="descr">
                                        Вы можете в любой момент отозвать согласие на использование cookie, кроме технически необходимых, или настроить параметры обработки cookie в настройках вашего браузера:
                                    </div>
                                    <div className="ol">
                                        <div className="li">
                                            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Google Chrome</a>
                                        </div>
                                        <div className="li">
                                            <a href="https://support.mozilla.org/ru/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noreferrer">Mozilla Firefox</a>
                                        </div>
                                        <div className="li">
                                            <a href="https://support.apple.com/ru-ru/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">Safari</a>
                                        </div>
                                        <div className="li">
                                            <a href="https://support.microsoft.com/ru-ru/microsoft-edge" target="_blank" rel="noreferrer">Microsoft Edge</a>
                                        </div>
                                    </div>
                                    <div className="descr mt-2">
                                        Отключение некоторых типов cookie может повлиять на функциональность Сервиса.
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 text-start">
                                <div className="col">
                                    <h5>5. Сторонние cookie</h5>
                                    <div className="descr">
                                        На Сервисе могут использоваться сторонние аналитические сервисы (например, Яндекс.Метрика), которые также размещают cookie на вашем устройстве. Эти сервисы обрабатывают обезличенные данные в соответствии с их собственными политиками конфиденциальности.
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 text-start">
                                <div className="col">
                                    <h5>6. Изменение политики</h5>
                                    <div className="descr">
                                        Администрация Сервиса оставляет за собой право вносить изменения в настоящую Политику использования файлов cookie. Новая версия вступает в силу с момента её публикации на данной странице.
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 text-start">
                                <div className="col">
                                    <h5>7. Контакты</h5>
                                    <div className="descr">
                                        Если у вас возникли вопросы по поводу использования cookie, вы можете связаться с нами по адресу электронной почты, указанному на сайте.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CookiesPage;
