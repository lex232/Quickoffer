import React from 'react';
import Header from '../site/includes/Header.jsx';
import Footer from '../site/includes/Footer.jsx';
import RegistrationForm from '../../components/forms/auth/Registration.jsx';

const RegistrationPage = ({ loginstate }) => {

    return (
        <body>
            <header className="container-fluid">
                <Header/>
            </header>
            <main className="container px4">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-3 mx-auto text-center"><RegistrationForm loginstate={loginstate}/></div>
                </div>
            </main>
            <footer className="container-fluid">
                <Footer/>
            </footer>
        </body>
      );
    };
    
    export default RegistrationPage;