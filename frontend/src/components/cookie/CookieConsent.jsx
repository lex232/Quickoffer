import { useState, useEffect } from 'react';
import './styles.css'


const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent-banner">
            <div className="cookie-consent-content">
                <p>
                    Мы используем файлы <a href="/privacy">cookies</a>, чтобы улучшить ваш опыт использования сайта.
                    Продолжая, вы соглашаетесь с их использованием. Запретить эти действия можно в настройках браузера.
                </p>
                <button onClick={handleAccept} className="btn btn-sm btn-primary">
                    Принять
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;