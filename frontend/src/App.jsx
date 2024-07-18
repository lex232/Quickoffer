/**
* APP QuickOffer - Приложение коммерческих предложений для
* монтажников СКС, электриков и т.д.
*/
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { AuthContext, UserContext } from './contexts'

import './App.css';
import user_api from './api/user_api';

/**
* Страницы
*/
import MainPage from './pages/site/mainpage/Main'
import CatalogPage from './pages/site/catalog/Catalog';
import LoginPage from './pages/auth/LoginPage';
import RegistrationPage from './pages/auth/RegistrationPage';
import PrivacyPage from './pages/site/privacy/PrivacyPage';

/**
* Страницы для авторизованного пользователя
*/
import ProfilePage from './pages/profile/ProfilePage';
import ProfileDashboard from './pages/profile/main/ProfileMain';

import ClientDashboard from './pages/profile/clients/ClientDashboard';
import ClientCreate from './pages/profile/clients/ClientsCreate';
import ClientsEdit from './pages/profile/clients/ClientsEdit';

import ItemsDashboard from './pages/profile/items/ItemsDashboard';
import ItemsCreate from './pages/profile/items/ItemsCreate';
import ItemsEdit from './pages/profile/items/ItemsEdit';

import OfferDashboard from './pages/profile/offer/OfferDashboard';
import OfferCreate from './pages/profile/offer/OfferCreate';
import OfferShow from './pages/profile/offer/OfferShow';
import OfferEdit from './pages/profile/offer/OfferEdit';

import ProfileEdit from './pages/profile/profile/ProfileEdit';


function RequireAuth({ children, loginstate=false }) {
  /**
  * Проверка необходимости авторизации
  */
  let location = useLocation();
  if (!loginstate) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  /**
  * Главный компонент приложения
  */

  const [ loggedIn, setLoggedIn ] = useState(null)
  const [ user, setUser ] = useState({})

  const authorization = (username, password) => {
    /**
    * Проверка авторизации через Token 
    */
    user_api.signin({
      username, password
    }).then(res => {
      if (res.auth_token) {
        localStorage.setItem('token', res.auth_token)
        user_api.getUserData()
          .then(res => {
            setUser(res)
            setLoggedIn(true)
          })
          .catch(err => {
            setLoggedIn(false)
          })
      } else {
        setLoggedIn(false)
      }
    })
    .catch(err => {
      const errors = Object.values(err)
      if (errors) {
        alert(errors.join(', '))
      }
      setLoggedIn(false)
    })
  }

  useEffect(_ => {
    const token = localStorage.getItem('token')
    if (token) {
      user_api.getUserData()
        .then(res => {
          setUser(res);
          setLoggedIn(true);
        })
        .catch(err => {
          setLoggedIn(false);
        })
    } else {
    setLoggedIn(false)
    }
  }, []);

  const onSignOut = () => {
    /**
    * Удаление токена - выход пользователя
    */
    user_api.signout()
      .then(res => {
        localStorage.removeItem('token')
        localStorage.removeItem('items')
        setLoggedIn(false)
      })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
  }

  if (loggedIn === null) {
    return <div className="">Loading...</div>
  }

  return (
    <AuthContext.Provider value={loggedIn}>
      <UserContext.Provider value={user}>
      <div className="QuickOffer App">
        <BrowserRouter>

          <Routes>
            <Route path="/" element={<MainPage loginstate={loggedIn} onSignOut={onSignOut} user={user}/>}></Route>
            <Route path='/catalog' element={<CatalogPage loginstate={loggedIn} onSignOut={onSignOut} user={user}/>}></Route>
            <Route path='/privacy' element={<PrivacyPage loginstate={loggedIn} onSignOut={onSignOut} user={user}/>}></Route>

            <Route path="/login" element={<LoginPage loginstate={loggedIn} onSignIn={authorization} />}/>
            <Route path="/registration" element={<RegistrationPage loginstate={loggedIn} />}/>

            <Route path="/profile" element={
              <RequireAuth loginstate={loggedIn}>
                <ProfilePage
                  loginstate={loggedIn}
                  onSignOut={onSignOut}
                  user={user}/>
              </RequireAuth>}>
              <Route path="" element={<ProfileDashboard/>}/>
              <Route path="clients/create" element={<ClientCreate />}/>
              <Route path="clients/list" element={<ClientDashboard />}/>
              <Route path='clients/edit' element={<ClientsEdit />}/>

              <Route path="items/list" element={<ItemsDashboard />}/>
              <Route path="items/create" element={<ItemsCreate />}/>
              <Route path='items/edit' element={<ItemsEdit />}/>
              
              <Route path="offer/list" element={<OfferDashboard />}/>
              <Route path='offer/list/show' element={<OfferShow />}/>
              <Route path="offer/create" element={<OfferCreate />}/>
              <Route path='offer/edit' element={<OfferEdit />}/>

              <Route path="my-organization/edit" element={<ProfileEdit />}/>
            </Route>

            </Routes> 
        </BrowserRouter>
      </div>
      </UserContext.Provider>
    </AuthContext.Provider>
    );
}

export default App;
