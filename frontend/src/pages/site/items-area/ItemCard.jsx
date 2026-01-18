import { Helmet } from 'react-helmet-async';
import AddNewTable from '../../../utils/text-operations/addTable';

const ItemCard = ({ item, loading, error, onBack }) => {
  // Состояние загрузки
  if (loading) {
    return (
      <div className="col d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  // Ошибка: товар не найден
  if (error || !item) {
    return (
      <div className="col d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h3>❌ Товар не найден</h3>
          <p className="text-muted">Проверьте ссылку или вернитесь в каталог.</p>
          <button
            className="btn btn-outline-primary mt-2"
            onClick={onBack}
          >
            Вернуться в каталог
          </button>
        </div>
      </div>
    );
  }

  // Успешная загрузка — показываем карточку
  const lastGroup = item.group?.[item.group.length - 1];
  const categoryTitle = lastGroup?.title || '—';
  const brandTitle = item.brand?.title || '—';

  return (
    <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
      <Helmet>
        <title>{item.title} — {brandTitle} - {categoryTitle} | OfferGuru</title>
        <meta
          name="description"
          content={`Карточка товара ${item.title} бренда ${brandTitle} в категории ${categoryTitle}`}
        />
      </Helmet>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{item.title} — {brandTitle}</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={onBack}>
          Назад к каталогу
        </button>
      </div>

      <div className="row">
        {/* Текст слева */}
        <div className="col-md-6">
          <p className="fs-4 text-primary fw-bold">
            {item.price_retail?.toLocaleString('ru-RU')} ₽
          </p>

          {item.brand && <p><strong>Бренд:</strong> {brandTitle}</p>}
          {item.description_general && <><h5>Описание товара</h5>
           <div className='description-item pt-1'>
            {item.description_general}
          </div></>}

          <h5>Характеристики товара</h5>
          <div className='description-item pt-1'>
            {AddNewTable(item.description || '')}
          </div>

          <h5>Категория: {categoryTitle}</h5>
          <p className="text-muted fst-italic">{lastGroup?.description || 'Описание категории отсутствует'}</p>
        </div>

        {/* Изображение справа */}
        <div className="col-md-6">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="img-fluid border rounded"
              style={{ maxHeight: '400px', objectFit: 'contain', width: '100%' }}
            />
          ) : (
            <div className="bg-light border d-flex align-items-center justify-content-center rounded"
              style={{ height: '400px' }}>
              <span className="text-muted">Изображение отсутствует</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;