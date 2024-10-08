import React, { useState, useRef } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import user_api from '../../../api/user_api';
import SimplePopup from '../../popup/refPopup';

const RegistrationForm = ({ loginstate }) => {
    const [ login, setLogin ] = useState(null)
    const [ mail, setMail ] = useState(null)
    const [ password, setPass ] = useState(null)
    const [ repeatPassword, setRepeatPass ] = useState(null)
    const [ regErrors, setRegErrors ] = useState(null)
    const navigate = useNavigate()

    const popupRegRef = useRef();
    const openRegPopup = () => popupRegRef.current.open();

    function handleRegistrationCLiсk(e) {
        e.preventDefault();
        if (password !== repeatPassword) {
            setRegErrors('Вы ввели не одинаковые пароли!')
            openRegPopup();
        }
        
        else {user_api.signup({ email: mail, password, username: login})
          .then(res => {
            if (res) {
                return navigate("/login/", {state: {success: true}})
            }
          })
          .catch(err => {
            const errors = Object.values(err)
            if (errors) {
                let temp_errors = []
                errors[0].forEach((element) => temp_errors.push(element))
                setRegErrors('Возможные ошибки: \n' + temp_errors.join('\n'))
                openRegPopup();
            }
          })
        }
    }

    if (loginstate === true) {
        return navigate("/")
    }
    
    return (
        <main className="form-signin w-100">
            <SimplePopup refPopup={popupRegRef} heading={'Не удалось зарегистрироваться'} text={regErrors}/>
        <form>
            <h1 className="h3 mb-3 fw-normal mb-2">Регистрация</h1>
            <div className='text-center'>
                Уже зарегистрированы? <a href="/login">Авторизуйтесь!</a>
            </div>
            <div className="form-floating">
                <input type="text" autoComplete="new-password" autocapitalize="off" className="form-control my-3" id="floatingInput" placeholder="Login" onChange={(e) => setLogin(e.target.value)}/>
                <label for="floatingInput">Логин</label>
            </div>
            <div className="form-floating">
                <input type="mail" className="form-control my-3" autocapitalize="off" id="floatingMail" placeholder="example@example.com" onChange={(e) => setMail(e.target.value)}/>
                <label for="floatingInput">Почта</label>
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
                Нажимая «Продолжить», вы принимаете <a href="/terms">пользовательское соглашение</a> и <a href="/privacy">политику конфиденциальности</a>
            </div>
        </form>
        </main>
    );
};

export default RegistrationForm;