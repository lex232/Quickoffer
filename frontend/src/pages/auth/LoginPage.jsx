import React from 'react';
import Header from '../site/includes/Header.jsx';
import Footer from '../site/includes/Footer.jsx';
import Login from '../../components/forms/auth/Login.jsx';
import { Helmet } from 'react-helmet-async';
import './styles.css'

const LoginPage = ({ loginstate, onSignIn }) => {
    return (
        <div className="auth-page">
            <Helmet>
                <title>OfferGuru - страница авторизации</title>
                <meta name="description" content="Авторизуйтесь, чтобы начать пользоваться сервисом коммерческих предложений" />
            </Helmet>
            <Header />
            <main>
                <Login loginstate={loginstate} onSignIn={onSignIn} />
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;
