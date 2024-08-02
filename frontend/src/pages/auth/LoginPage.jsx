import React from 'react';
import Header from '../site/includes/Header.jsx';
import Footer from '../site/includes/Footer.jsx';
import Login from '../../components/forms/auth/Login.jsx';

const LoginPage = ({ loginstate, onSignIn }) => {
    /**
    * Страница логина
    */

    return (
        <body>
            <header className="container-fluid">
                <Header/>
            </header>
            <main className="container px4">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-3 text-center mx-auto"><Login loginstate={loginstate} onSignIn={ onSignIn }/></div>
                </div>
            </main>
            <footer className="container-fluid">
                <Footer/>
            </footer>
        </body>
      );
    };
    
    export default LoginPage;