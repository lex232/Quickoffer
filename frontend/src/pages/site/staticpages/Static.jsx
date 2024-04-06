import React from 'react';
import { Outlet } from "react-router-dom";

import Header from '../includes/Header.jsx';
import Footer from '../includes/Footer.jsx';

const StaticPage = ({ loginstate, onSignOut, user }) => {

    return (
        <div>
            <div className="mx-auto py-4">
                <Header loginstate={loginstate} onSignOut={onSignOut} user={user}/>
            </div>
            <div className="container px4">
                <Outlet loginstate={loginstate}/>
            </div>
            <div className="mx-auto py-4">
                <Footer/>
            </div>
        </div>
      );
    };
    
    export default StaticPage;