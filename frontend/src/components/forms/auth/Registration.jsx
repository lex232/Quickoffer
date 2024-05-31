import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Registration = ({ loginstate }) => {
    const [ login, setLogin ] = useState(null)
    const [ password, setPass ] = useState(null)
    const [ repeatPassword, setRepeatPass ] = useState(null)
    const navigate = useNavigate()

    const handleChangePass = (e) => {
        setPass(e.target.value);
    }

    const handleChangeLogin = (e) => {
        setLogin(e.target.value);
    }

    function handleRegistrationCLiсk(e) {
        // Обработать клик

        e.preventDefault();

        }

    if (loginstate === true) {
        return navigate("/profile")
    }
    
    return (
        <main className="form-signin w-100">
        <form>
            <h1 className="h3 mb-3 fw-normal">Регистрация</h1>

            <div className="form-floating">
                <input type="username" className="form-control my-3" id="floatingInput" placeholder="example@example.com" onChange={(e) => handleChangeLogin(e)}/>
                <label for="floatingInput">Логин</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control my-3" id="floatingPassword" placeholder="Password" onChange={(e) => handleChangePass(e)}/>
                <label for="floatingPassword">Пароль</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control my-3" id="floatingPassword" placeholder="Password" onChange={(e) => handleChangePass(e)}/>
                <label for="floatingPassword">Повторите пароль</label>
            </div>
            <div className="checkbox my-3">
                <label>
                    <input type="checkbox" value="remember-me" /> Запомнить меня
                </label>
            </div>
            <button onClick={(e) => handleRegistrationCLiсk(e)} className="w-100 btn btn-lg btn-primary" type="submit">Войти</button>
        </form>
        </main>
    );
};

export default Registration;