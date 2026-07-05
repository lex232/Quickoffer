import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock } from 'react-feather';

const Login = ({ loginstate, onSignIn }) => {
    const [login, setLogin] = useState('')
    const [password, setPass] = useState('')

    const { state } = useLocation();
    const success = state?.success;

    const navigate = useNavigate()

    function handleLoginClick(e) {
        e.preventDefault();
        onSignIn(login, password)
    }

    if (loginstate === true) {
        return navigate("/profile")
    }

    return (
        <div className="auth-card">
            {success && <div className="auth-success">Регистрация успешно завершена!</div>}
            <h1>Войдите</h1>
            <p className="auth-subtitle">
                Нет аккаунта? <a href="/registration">Зарегистрироваться</a>
            </p>
            <form onSubmit={handleLoginClick}>
                <div className="auth-input-wrap">
                    <User size={18} className="auth-input-icon" />
                    <input
                        type="text"
                        autoComplete="username"
                        autoCapitalize="off"
                        placeholder="Логин"
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div className="auth-input-wrap">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                        type="password"
                        autoComplete="current-password"
                        placeholder="Пароль"
                        onChange={(e) => setPass(e.target.value)}
                    />
                </div>
                <button type="submit" className="auth-btn">Войти</button>
            </form>
        </div>
    );
};

export default Login;
