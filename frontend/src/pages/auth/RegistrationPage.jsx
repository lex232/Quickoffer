import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../site/includes/Header.jsx';
import Footer from '../site/includes/Footer.jsx';
import RegistrationForm from '../../components/forms/auth/Registration.jsx';
import { Helmet } from 'react-helmet-async';
import './styles.css'

const RegistrationPage = ({ loginstate }) => {

    if (loginstate) {
        return <Navigate to="/profile" replace />;
    }

    return (
        <div className="auth-page">
            <Helmet>
                <title>OfferGuru - страница регистрации</title>
                <meta name="description" content="Зарегистрируйтесь, чтобы начать пользоваться сервисом коммерческих предложений" />
            </Helmet>
            <Header />
            <main>
                <RegistrationForm loginstate={loginstate} />
            </main>
            <Footer />
        </div>
    );
};

export default RegistrationPage;
