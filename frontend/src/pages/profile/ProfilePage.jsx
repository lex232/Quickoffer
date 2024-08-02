import React, { useState } from 'react';

import Header from '../site/includes/Header.jsx';
import ProfileSidebar from './sidebar/ProfileSidebar.jsx';

import { Outlet } from 'react-router-dom';
import { AlignJustify, XCircle } from 'react-feather';
import './styles.css'

const MainProfile = ({ loginstate, onSignOut, user }) => {

    const style_visible = "col-md-3 col-lg-2 d-md-block sidebar sidebar-custom collapse"
    const style_non_visible = "col-md-3 col-lg-2 d-md-block sidebar sidebar-custom"

    const [ isCollapsed, setIsCollapsed] = useState(style_visible)

    const handleMenu = (e) => {
        // Прячет меню
            e.preventDefault();
            if (isCollapsed === style_visible) {
                setIsCollapsed(style_non_visible)
            }
            else {setIsCollapsed(style_visible)}
        }

    return (
        <div>
            <div className="container-fluid"> 
                <Header loginstate={loginstate} onSignOut={onSignOut} user={user}/>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className=''>
                        <button className='button-on-mobile pb-2 ps-2' onClick={(e) => handleMenu(e)}>    
                            {style_visible === isCollapsed ? <AlignJustify /> : <XCircle />}
                        </button>
                    </div>  
                    <ProfileSidebar styleCollapse={isCollapsed}/>
                    <Outlet loginstate={loginstate} onSignOut={onSignOut} user={user}/>
                </div>
            </div>
        </div>
      );
    };
    
    export default MainProfile;