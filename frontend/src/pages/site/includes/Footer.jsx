import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import YearNow from '../../../utils/yearnow';

const Footer = () => {
  return (
    <div className="container-fluid">
    <footer className="d-flex flex-wrap py-3 my-4 border-top">
        <ul className="nav col-md-4 justify-content-start">
          <p className="col-md-4 mb-0 text-muted">&copy; {YearNow()} QuickOffer (с)</p>
        </ul>
        <ul className="nav col-md-8 justify-content-end">
          <li className="nav-item"><a href="/" className="nav-link px-2 text-muted">Главная</a></li>
        </ul>
    </footer>
    </div>
  );
};

export default Footer;