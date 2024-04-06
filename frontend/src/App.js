import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import logo from './logo.svg';
import './App.css';
import user_api from './api/user_api';

import MainPage from './pages/site/Main'

import { AuthContext, UserContext } from './contexts'

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

  // Не грузим рендер, пока не получили значение авторизации
  if (loggedIn === null) {
    return <div className="">Loading!!</div>
  }

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

            </Routes> 
        </BrowserRouter>
      </div>
      </UserContext.Provider>
    </AuthContext.Provider>
    );
}

export default App;
