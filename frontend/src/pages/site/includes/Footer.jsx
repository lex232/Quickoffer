import YearNow from '../../../utils/yearnow';
import './styles.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-copy">&copy; {YearNow()} OfferGuru</span>
        <nav className="footer-nav">
          <a href="/" className="footer-link">Главная</a>
          <a href="/privacy" className="footer-link">Политика конфиденциальности</a>
          <a href="/disclaimer" className="footer-link">Отказ от ответственности</a>
          <a href="/cookies" className="footer-link">Cookie</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;