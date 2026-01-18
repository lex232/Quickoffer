import { Link } from 'react-router-dom';
import './style.css';
import img404 from '../../../static/image/404/404.png'
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <Helmet>
        <title>OfferGuru - страница 404</title>
        <meta name="description" content="Онлайн приложение для быстрого создания коммерческих предложений в сфере СКС, электрики, видеонаблюдения и тд." />
      </Helmet>
      <div className="not-found-content">
        <img
          src={img404}
          alt="Страница не найдена"
          className="not-found-image"
        />
        <h1 className="not-found-title">Упс! Страница не найдена</h1>
        <p className="not-found-text">
          Возможно, она была перемещена, удалена или вы просто ошиблись в адресе.
        </p>
        <Link to="/" className="btn btn-primary not-found-button">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}