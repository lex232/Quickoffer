// APP QuickOffer
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { AuthContext, UserContext } from './contexts'

import logo from './logo.svg';
import './App.css';
import user_api from './api/user_api';

// Страницы
import MainPage from './pages/site/mainpage/Main'
import CatalogPage from './pages/site/catalog/Catalog';

// Страницы для авторизованного пользователя
import LoginPage from './pages/auth/LoginPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProfileDashboard from './pages/profile/main/ProfileMain';

import ClientCreate from './pages/profile/clients/ClientsCreate';
import ClientsEdit from './pages/profile/clients/ClientsEdit';
import ClientDashboard from './pages/profile/clients/ClientDashboard';

import ItemsCreate from './pages/profile/items/ItemsCreate';

import OfferCreate from './pages/profile/offer/OfferCreate';
import OfferDashboard from './pages/profile/offer/OfferDashboard';
import OfferShow from './pages/profile/offer/OfferShow';

import ProfileEdit from './pages/profile/profile/ProfileEdit';

function RequireAuth({ children, loginstate=false }) {
  let location = useLocation();
  if (!loginstate) {
    // Перенаправляет на страницу логина
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const [ loggedIn, setLoggedIn ] = useState(null)
  const [ user, setUser ] = useState({})

  const [ cart, setCart ] = useState([])

  const authorization = (username, password) => {
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
    user_api.signout()
      .then(res => {
        localStorage.removeItem('token')
        setLoggedIn(false)
      })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
  }

  // Не грузим рендер, пока не получили значение авторизации
  if (loggedIn === null) {
    return <div className="">Loading!!</div>
  }

  return (
    <AuthContext.Provider value={loggedIn}>
      <UserContext.Provider value={user}>
      <div className="QuickOffer App">
        <BrowserRouter>

          <Routes>
            <Route path="/" element={
                <MainPage 
                  loginstate={loggedIn}
                  onSignOut={onSignOut}
                  user={user}/>}>
            </Route>
            <Route path='/catalog' element={
                <CatalogPage
                  loginstate={loggedIn}
                  onSignOut={onSignOut}
                  user={user}/>}>
            </Route>

            <Route path="/login" element={<LoginPage
              loginstate={loggedIn} 
              onSignIn={authorization} />
            }/>

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

              <Route path="items/create" element={<ItemsCreate />}/>

              <Route path="offer/list" element={<OfferDashboard />}/>
              <Route path='offer/list/show' element={<OfferShow />}/>
              <Route path="offer/create" element={<OfferCreate />}/>

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
