import React from 'react';

import Header from '../site/includes/Header.jsx';
import ProfileSidebar from './sidebar/ProfileSidebar.jsx';

import { Outlet } from 'react-router-dom';


const MainProfile = ({ loginstate, onSignOut, user }) => {

    return (
        <div>
            <div className="container-fluid"> 
                <Header loginstate={loginstate} onSignOut={onSignOut} user={user}/>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <ProfileSidebar />
                    <Outlet loginstate={loginstate} onSignOut={onSignOut} user={user}/>
                </div>
            </div>
        </div>
      );
    };
    
    export default MainProfile;