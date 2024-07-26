import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css'

const Login = ({ loginstate, onSignIn }) => {
    const [ login, setLogin ] = useState(null)
    const [ password, setPass ] = useState(null)
    let {state} = useLocation();
    let success = undefined

    if (state) {
        success = state.success;
    }
    const navigate = useNavigate()

    function handleLoginCLiсk(e) {
        // Обработать клик
        e.preventDefault();
        success = undefined
        state = undefined
        onSignIn(login, password)
    }

    if (loginstate === true) {
        return navigate("/profile")
    }
    
    return (
        <main className="form-signin w-100">
            <form>
                {success && <span><h4 className="h4 mb-3 fw-normal">Регистрация успешно завершена!</h4></span>}
                <h1 className="h3 mb-3 fw-normal">Войдите</h1>

                <div className="form-floating">
                    <input type="username" autocomplete="new-password" className="form-control my-3" id="floatingInput" placeholder="Login" onChange={(e) => setLogin(e.target.value)}/>
                    <label for="floatingInput">Логин</label>
                </div>
                <div className="form-floating">
                    <input type="password" autocomplete="new-password" className="form-control my-3" id="floatingPassword" placeholder="Password" onChange={(e) => setPass(e.target.value)}/>
                    <label for="floatingPassword">Пароль</label>
                </div>
                <div className="checkbox my-3">
                    <label>
                        <input type="checkbox" className='form-check-input pull-left' value="remember-me" /> Запомнить меня
                    </label>
                </div>
                <button onClick={(e) => handleLoginCLiсk(e)} className="w-100 btn btn-lg btn-primary mb-4" type="submit">Войти</button>
                <div className="text-center">
                    <p>Не зарегистрированы? <a href="/registration">Присоединиться</a></p>
                </div>
            </form>
        </main>
    );
};

export default Login;