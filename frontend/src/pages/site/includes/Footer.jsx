import YearNow from '../../../utils/yearnow';
import './styles.css'

const Footer = () => {
  /**
  * Подвал сайта
  */

  return (
    <div className="container-fluid">
      <footer className="d-flex flex-wrap mt-4">
        <ul className="col-6 footer-nav-left">
          <li className="nav-item text-muted">&copy; {YearNow()} OfferGuru (с)</li>
        </ul>
        <ul className="col-6 footer-nav-right text-end">
          <li className="nav-item">
            <a href="/" className="nav-link text-muted footer-link-right">Главная</a>
          </li>
          <li className="nav-item">
            <a href="/privacy" className="nav-link text-muted footer-link-right">Политика конфиденциальности</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Footer;