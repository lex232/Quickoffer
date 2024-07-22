import React from 'react';
import Header from '../site/includes/Header.jsx';
import Footer from '../site/includes/Footer.jsx';
import { Outlet } from 'react-router-dom';

const BasePage = ({ loginstate, onSignOut, user }) => {
    /**
    * Базовый шаблон
    */

    return (
        <body>
            <header className="container-fluid">
                <Header loginstate={loginstate} onSignOut={onSignOut} user={user}/>
            </header>
            <main className="container px4">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-3 text-center mx-auto"><Outlet loginstate={loginstate} onSignOut={onSignOut} user={user}/></div>
                </div>
            </main>
            <footer className="container-fluid">
                <Footer/>
            </footer>
        </body>
      );
    };
    
    export default LoginPage;