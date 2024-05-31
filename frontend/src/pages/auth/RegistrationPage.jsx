import React from 'react';
import Header from '../site/includes/Header.jsx';
import Footer from '../site/includes/Footer.jsx';
import Registration from '../../components/forms/auth/Registration.jsx';

const RegistrationPage = ({ loginstate }) => {

    return (
        <div>
            <div className="container-fluid">
                <Header/>
            </div>
            <div className="container px4">
                <div className="row">
                    <div className="col-3 text-center mx-auto"><Registration loginstate={loginstate}/></div>
                </div>
            </div>
            <div className="container-fluid">
                <Footer/>
            </div>
        </div>
      );
    };
    
    export default RegistrationPage;