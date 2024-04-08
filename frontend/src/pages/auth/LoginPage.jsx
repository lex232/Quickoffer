import React from 'react';
import Header from '../site/includes/Header.jsx';
import Footer from '../site/includes/Footer.jsx';
import Login from '../../components/forms/auth/Login.jsx';

const LoginPage = ({ loginstate, onSignIn }) => {

    return (
        <div>
            <div className="container-fluid">
                <Header/>
            </div>
            <div className="container px4">
                <div className="row">
                    <div className="col-3 text-center mx-auto"><Login loginstate={loginstate} onSignIn={ onSignIn }/></div>
                </div>
            </div>
            <div className="container-fluid">
                <Footer/>
            </div>
        </div>
      );
    };
    
    export default LoginPage;