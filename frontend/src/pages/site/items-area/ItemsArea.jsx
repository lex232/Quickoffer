import React, { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { useNavigate, Link } from 'react-router-dom';

import items_api from '../../../api/items_api';
import brands_api from '../../../api/brands_api';
import './styles.css';
import AddNewTable from '../../../utils/text-operations/addTable';

import { Plus } from 'react-feather';
import AddToCartButton from '../../../components/cart/AddToCartButton';

const ItemsArea = ({ category_id, loginstate, title, description, item_type }) => {
  const navigate = useNavigate();

  const [listItems, setListItems] = useState([]);
  const [isLoaddingItems, setIsLoaddingItems] = useState(true);
  const [orderingPrice, setOrderingPrice] = useState('price_retail');

  const [brandFilters, setBrandsFilters] = useState([]);
  const [isLoaddingBrandFilters, setIsLoaddingBrandFilters] = useState(false);

  const [page, setPage] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  const [currentpagestate, setCurrentPageState] = useState(1);
  const [cartVersion, setCartVersion] = useState(0);

  // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

  const checkStatesCheckedInBrands = (brands_for_check) => {
    return brands_for_check.every(obj => obj.checked === true);
  };

  const loadItemsWithFilters = (page, categoryId, brandsList) => {
    setIsLoaddingItems(true);

    let brands_id = '';
    brandsList.forEach(object => {
      if (object.checked) {
        brands_id += String(object.id) + ',';
      }
    });
    brands_id = brands_id ? brands_id.slice(0, -1) : '';

    // brandsList пуст (нет брендов в категории) → не фильтруем
    // brandsList не пуст, но все сняты → brands_id='' → покажем ничего
    const noBrands = brandsList.length === 0;

    if (loginstate === false) {
      getItems(page, categoryId, noBrands ? undefined : brands_id);
    } else {
      if (categoryId === -1 || categoryId === -2) {
        getItemsOnlyUsers(page, item_type);
      } else {
        getItemsAuth(page, categoryId, noBrands ? undefined : brands_id);
      }
    }
  };

  // === ЗАПРОСЫ К API ===

  const getItemsOnlyUsers = (page, item_type) => {
    items_api.getItemsUserPaginate({ page, status: item_type || '' })
      .then(res => {
        setpageCount(Math.ceil(res.count / 8));
        setListItems(res.results);
      })
      .catch(e => console.log(e))
      .finally(() => setIsLoaddingItems(false));
  };

  const getItems = (page, category_id, brands_id) => {
    items_api.getItemsFilterCategoryPaginate({
      page,
      group: category_id,
      ordering_price: orderingPrice,
      brand: brands_id,
      item_type,
    })
      .then(res => {
        setpageCount(Math.ceil(res.count / 8));
        setListItems(res.results);
      })
      .catch(e => console.log(e))
      .finally(() => setIsLoaddingItems(false));
  };

  const getItemsAuth = (page, category_id, brands_id) => {
    items_api.getItemsAuthFilterCategoryPaginate({
      page,
      group: category_id,
      ordering_price: orderingPrice,
      brand: brands_id,
      item_type,
    })
      .then(res => {
        setpageCount(Math.ceil(res.count / 8));
        setListItems(res.results);
      })
      .catch(e => console.log(e))
      .finally(() => setIsLoaddingItems(false));
  };

  // === ОБРАБОТЧИКИ СОБЫТИЙ ===

  const handlePageClick = (data) => {
    const newPage = data.selected + 1;
    setPage(data.selected);
    setCurrentPageState(newPage);
    loadItemsWithFilters(newPage, category_id, brandFilters);
  };

  const HandleChangeCheckedBrandFilter = (e, id) => {
    e.preventDefault();
    const updatedBrands = brandFilters.map(brand =>
      brand.id === id ? { ...brand, checked: !brand.checked } : brand
    );
    setBrandsFilters(updatedBrands);
    loadItemsWithFilters(currentpagestate, category_id, updatedBrands);
  };

  const HandleChangeBrandAllFilter = (e) => {
    e.preventDefault();
    const allChecked = checkStatesCheckedInBrands(brandFilters);
    const newValue = !allChecked;
    const updatedBrands = brandFilters.map(brand => ({ ...brand, checked: newValue }));
    setBrandsFilters(updatedBrands);
    loadItemsWithFilters(currentpagestate, category_id, updatedBrands);
  };

  const triggerCartUpdate = () => {
    setCartVersion(v => v + 1);
  };

  const CreateItem = (e) => {
    e.preventDefault();
    navigate("/profile/items/create");
  };

  // === ЭФФЕКТЫ ===

  useEffect(() => {
    if (category_id == null) return;

    // Сброс состояния при смене категории
    setBrandsFilters([]);
    setIsLoaddingBrandFilters(true);
    setIsLoaddingItems(true);

    // Загружаем бренды
    brands_api.getBrandsOnCategory({ category_id })
      .then(res => {
        const new_res = res.map(item => ({ ...item, checked: true }));
        setBrandsFilters(new_res);
        // Сразу грузим товары с новыми брендами
        loadItemsWithFilters(1, category_id, new_res);
        setCurrentPageState(1);
        setPage(0);
      })
      .catch(e => {
        console.log('Ошибка загрузки брендов:', e);
        setIsLoaddingItems(false);
      })
      .finally(() => {
        setIsLoaddingBrandFilters(false);
      });
  }, [category_id, orderingPrice]);

  // === РЕНДЕР ===

  const allBrandsChecked = checkStatesCheckedInBrands(brandFilters);

  return (
    <div className="col">
      {isLoaddingItems && (
        <div className="d-flex mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      )}

      <div className="items-header">
        <h4>{title}</h4>
        {(category_id === -1 || category_id === -2) && (
          <button onClick={CreateItem} className="btn btn-primary btn-create-small" type="button">
            <Plus size={16} className="me-1" />
            {category_id === -1 ? 'Добавить товар' : 'Добавить услугу'}
          </button>
        )}
      </div>
      {description && <div className="items-header-desc">{description}</div>}

      <div className="items-filters">
        <select
          className="items-sort-select"
          value={orderingPrice}
          onChange={(e) => {
            setOrderingPrice(e.target.value);
            loadItemsWithFilters(1, category_id, brandFilters);
            setCurrentPageState(1);
            setPage(0);
          }}
        >
          <option value="price_retail">Цена ↑</option>
          <option value="-price_retail">Цена ↓</option>
        </select>

        {brandFilters.length > 0 && (
          <div className="items-brands">
            <button
              className={`items-brand-pill items-brand-pill--all ${allBrandsChecked ? 'active' : ''}`}
              onClick={HandleChangeBrandAllFilter}
            >
              Все
            </button>
            {brandFilters.map((brand) => (
              <button
                key={brand.id}
                className={`items-brand-pill ${brand.checked ? 'active' : ''}`}
                onClick={(e) => HandleChangeCheckedBrandFilter(e, brand.id)}
              >
                {brand.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="row g-3">
        {listItems && listItems.length > 0 ? (
          listItems.map((item) => {
            const isService = item.item_type === 'service';
            const hasImage = !!item.image;
            return (
              <div className={`col-12 col-sm-6 col-lg-4 col-xl-3`} key={item.id}>
                <div className={`general-item ${isService ? 'general-item--compact' : ''}`}>
                  {hasImage && (
                    <div className="area-img">
                      <img className="card-image" src={item.image} alt={item.title} />
                    </div>
                  )}
                  <div className="item-center">
                    {isService ? (
                      <div className="item-service-badge">Услуга</div>
                    ) : item.brand?.title || item.brand ? (
                      <div className="item-brand">
                        {item.brand?.title || item.brand}
                      </div>
                    ) : null}
                    {item.private_type === false && !isService ? (
                      <Link to={`/catalog/${item.slug}`} className="item-title-link">
                        {item.title}
                      </Link>
                    ) : (
                      <div className="item-title-plain">{item.title}</div>
                    )}
                    <div className="description-item">
                      {AddNewTable(item.description || '')}
                    </div>
                  </div>
                  <div className="item-bottom">
                    <div className="item-price">
                      {item.price_retail?.toLocaleString('ru-RU') || '—'} ₽
                    </div>
                    {loginstate && (
                      <AddToCartButton results={item} onCartChange={triggerCartUpdate} />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <div className="items-empty">
              В этой категории или по выставленным фильтрам пока нет товаров.
            </div>
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <div className="mt-4">
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            initialPage={page}
            forcePage={currentpagestate - 1}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      )}
    </div>
  );
};

export default ItemsArea;