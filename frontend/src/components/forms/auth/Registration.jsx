import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import user_api from '../../../api/user_api';

const RegistrationForm = ({ loginstate }) => {
    const [ login, setLogin ] = useState(null)
    const [ mail, setMail ] = useState(null)
    const [ name, setName ] = useState(null)
    const [ password, setPass ] = useState(null)
    const [ repeatPassword, setRepeatPass ] = useState(null)
    const navigate = useNavigate()

    function handleRegistrationCLiсk(e) {
        // Обработать клик
        if (password !== repeatPassword) {
            return alert('Пароли не одинаковые!')
        }
        e.preventDefault();
        user_api.signup({ email: mail, password, username: login, first_name: name})
          .then(res => {
            if (res) {
                return navigate("/login/")
            }
          })
          .catch(err => {
            const errors = Object.values(err)
            if (errors) {
              alert('Регистрация не удалась(. Возможные ошибки:' + errors)
            }
          })
    }

    if (loginstate === true) {
        return navigate("/")
    }
    
    return (
        <main className="form-signin w-100">
        <form>
            <h1 className="h3 mb-3 fw-normal mb-2">Регистрация</h1>
            <div className='text-center'>
                Уже зарегистрированы? <a href="/login">Авторизуйтесь!</a>
            </div>
            <div className="form-floating">
                <input type="text" autoComplete="new-password" className="form-control my-3" id="floatingInput" placeholder="Login" onChange={(e) => setLogin(e.target.value)}/>
                <label for="floatingInput">Логин</label>
            </div>
            <div className="form-floating">
                <input type="mail" className="form-control my-3" id="floatingMail" placeholder="example@example.com" onChange={(e) => setMail(e.target.value)}/>
                <label for="floatingInput">Почта</label>
            </div>
            <div className="form-floating">
                <input type="text" className="form-control my-3" id="floatingMail" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
                <label for="floatingInput">Имя</label>
            </div>
            <div className="form-floating">
                <input type="password" autoComplete="new-password" className="form-control my-3" id="floatingPassword" placeholder="Password" onChange={(e) => setPass(e.target.value)}/>
                <label for="floatingPassword">Пароль</label>
            </div>
            <div className="form-floating">
                <input type="password" autoComplete="new-password" className="form-control my-3" id="floatingPasswordRepeat" placeholder="Password" onChange={(e) => setRepeatPass(e.target.value)}/>
                <label for="floatingPassword">Повторите пароль</label>
            </div>
            <button onClick={(e) => handleRegistrationCLiсk(e)} className="w-100 btn btn-lg btn-primary mb-3" type="submit">Продолжить</button>

            <div className='text-center'>
                Нажимая «Продолжить», вы принимаете <a href="">пользовательское соглашение</a> и <a href="/privacy">политику конфиденциальности</a>
            </div>
        </form>
        </main>
    );
};

export default RegistrationForm;