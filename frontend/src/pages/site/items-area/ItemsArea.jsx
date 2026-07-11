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

  return (
    <div className="col">
      <div className="d-flex">
        {isLoaddingItems && (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        )}
      </div>

      <div className="container-fluid">
        <div className="row my-2 ps-2">
          <h4 className="col-6 p-0">{title}</h4>
          {category_id === -1 && (
            <div className="col-6 p-0">
              <button
                onClick={CreateItem}
                className="btn btn-primary btn-create-small"
                type="button"
              >
                <Plus size={16} className="me-2" />
                Добавить товар
              </button>
            </div>
          )}
          {category_id === -2 && (
            <div className="col-6 p-0">
              <button
                onClick={CreateItem}
                className="btn btn-primary btn-create-small"
                type="button"
              >
                <Plus size={16} className="me-2" />
                Добавить услугу
              </button>
            </div>
          )}
        </div>
        <div className="row my-2 ps-2">
          <span className="p-0">{description}</span>
        </div>
        <div className="pb-4">
          <select
            className="form-select"
            value={orderingPrice}
            onChange={(e) => {
              setOrderingPrice(e.target.value);
              // Сортировка сбрасывает на 1-ю страницу
              loadItemsWithFilters(1, category_id, brandFilters);
              setCurrentPageState(1);
              setPage(0);
            }}
          >
            <option value="price_retail">Сортировать по цене по возрастанию</option>
            <option value="-price_retail">Сортировать по цене по убыванию</option>
          </select>
        </div>
        <div className="row pb-2">
          {brandFilters.length > 0 && (
            <span>
              <div className="form-check checkbox-brands">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="all_brands"
                  checked={checkStatesCheckedInBrands(brandFilters)}
                  onClick={HandleChangeBrandAllFilter}
                />
                <label className="form-check-label pe-2" htmlFor="all_brands">
                  Все бренды
                </label>
              </div>
              {brandFilters.map((brand) => (
                <div className="form-check checkbox-brands" key={brand.id}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={brand.checked}
                    id={`brand-${brand.id}`}
                    onClick={(e) => HandleChangeCheckedBrandFilter(e, brand.id)}
                  />
                  <label className="form-check-label pe-2" htmlFor={`brand-${brand.id}`}>
                    {brand.title}
                  </label>
                </div>
              ))}
            </span>
          )}
        </div>

        <div className="row justify-content-start">
          {listItems && listItems.length > 0 ? (
            listItems.map((results) => (
              <div className="col-12 col-lg-6 col-xl-4 col-xxl-3 mb-5" key={results.id}>
                <div className="card h-100 general-item">
                  <div className="card-body p-0 item-center">
                    <div className="area-img">
                      {results.image && (
                        <img
                          className="card-image"
                          src={results.image}
                          alt={results.title}
                        />
                      )}
                    </div>
                    <div className="text-start">
                      <div className="ps-2">
                        {results.private_type === false && results.item_type === "product" ? (
                          <Link to={`/catalog/${results.slug}`} className="text-dark text-decoration-underline">
                            {results.title}
                          </Link>
                        ) : (
                          <span className="text-dark">{results.title}</span>
                        )}
                      </div>
                      {results.item_type === "product" && (
                        <div className="item-brand ps-2">
                          Производитель: <b>{results.brand?.title || results.brand || '—'}</b>
                        </div>
                      )}
                      <div className="description-item pt-1">
                        {AddNewTable(results.description || '')}
                      </div>
                    </div>
                  </div>
                  <div className="item-bottom">
                    <div className="item-price pe-2">
                      {results.price_retail?.toLocaleString('ru-RU') || '—'} руб.
                    </div>
                    {loginstate && (
                      <div className="card-footer d-flex p-2 pt-0 border-top-0 bg-transparent align-items-center">
                        <AddToCartButton results={results} onCartChange={triggerCartUpdate} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5">
                <p className="text-muted">
                  В этой категории или по выставленным фильтрам пока нет товаров.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"предыдущая"}
          nextLabel={"следующая"}
          initialPage={page}
          forcePage={currentpagestate - 1}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
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
      )}
    </div>
  );
};

export default ItemsArea;