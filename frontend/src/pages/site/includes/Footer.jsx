import React from 'react';

import YearNow from '../../../utils/yearnow';
import './styles.css'

const Footer = () => {
  /**
  * Подвал сайта
  */
  
  return (
    <div className="container-fluid">
    <footer className="d-flex flex-wrap py-3 my-4 px-4 border-top">
        <ul className="col-6 nav">
          <p className="nav-item text-muted">&copy; {YearNow()} QuickOffer (с)</p>
        </ul>
        <ul className="nav footer-nav-right">
          <li className="col-6 nav-item"><a href="/" className="nav-link px-2 text-muted footer-link-right">Главная</a></li>
        </ul>
    </footer>
    </div>
  );
};

export default Footer;