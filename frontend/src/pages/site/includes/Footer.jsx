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
        </nav>
      </div>
    </footer>
  );
};

export default Footer;