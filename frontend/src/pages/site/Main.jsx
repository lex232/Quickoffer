import React from 'react';
import News from './news/News.jsx';
import Header from './includes/Header.jsx';
import Footer from './includes/Footer.jsx';

const MainPage = ({ loginstate, onSignOut, user }) => {

    return (
            <div>
                <div className="mx-auto py-4">
                    <Header loginstate={loginstate} onSignOut={onSignOut} user={user}/>
                </div>
                <div className="container px4">
                    <div className="row">
                        hello
                    </div>
                </div>
                <div className="mx-auto py-4">
                    <Footer/>
                </div>
            </div>
      );
    };
    
    export default MainPage;