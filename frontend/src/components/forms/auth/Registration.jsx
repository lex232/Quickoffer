import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'react-feather';
import user_api from '../../../api/user_api';

const RegistrationForm = ({ loginstate }) => {
    const [login, setLogin] = useState('')
    const [mail, setMail] = useState('')
    const [password, setPass] = useState('')
    const [repeatPassword, setRepeatPass] = useState('')
    const [regErrors, setRegErrors] = useState(null)
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    async function handleRegistrationClick(e) {
        e.preventDefault();
        setRegErrors(null);

        if (password !== repeatPassword) {
            setRegErrors('Вы ввели не одинаковые пароли!')
            return
        }

        if (!login || !mail || !password) {
            setRegErrors('Заполните все поля')
            return
        }

        setLoading(true);

        try {
            const res = await user_api.signup({ email: mail, password, username: login })
            if (res) {
                return navigate("/login/", { state: { success: true } })
            }
        } catch (err) {
            const errors = Object.values(err)
            if (errors && errors[0]) {
                setRegErrors(errors[0].join('\n'))
            } else {
                setRegErrors('Произошла ошибка. Попробуйте снова.')
            }
        } finally {
            setLoading(false);
        }
    }

    if (loginstate === true) {
        return navigate("/")
    }

    return (
        <div className="auth-card">
            <h1>Регистрация</h1>
            <p className="auth-subtitle">
                Уже зарегистрированы? <a href="/login">Авторизуйтесь!</a>
            </p>
            <form onSubmit={handleRegistrationClick}>
                {regErrors && <div className="auth-error">{regErrors}</div>}

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
                    <Mail size={18} className="auth-input-icon" />
                    <input
                        type="email"
                        autoCapitalize="off"
                        placeholder="Почта"
                        onChange={(e) => setMail(e.target.value)}
                    />
                </div>
                <div className="auth-input-wrap">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                        type="password"
                        autoComplete="new-password"
                        placeholder="Пароль"
                        onChange={(e) => setPass(e.target.value)}
                    />
                </div>
                <div className="auth-input-wrap">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                        type="password"
                        autoComplete="new-password"
                        placeholder="Повторите пароль"
                        onChange={(e) => setRepeatPass(e.target.value)}
                    />
                </div>
                <div className="auth-checkbox">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <span>
                        Я прочитал и подтверждаю свое согласие с{' '}
                        <a href="/terms">пользовательским соглашением</a> и{' '}
                        <a href="/privacy">политикой конфиденциальности</a>
                    </span>
                </div>
                <button type="submit" className="auth-btn" disabled={!isChecked || loading}>
                    {loading ? 'Загрузка...' : 'Продолжить'}
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;
