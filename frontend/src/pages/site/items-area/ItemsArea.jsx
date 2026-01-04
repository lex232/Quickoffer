import React, { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { useNavigate, Link } from 'react-router-dom';

import items_api from '../../../api/items_api';
import brands_api from '../../../api/brands_api';
import './styles.css'
import AddNewTable from '../../../utils/text-operations/addTable';
import CheckSameCartItem from '../../../utils/items/checkSameCartItem';
import CartPlusItem from '../../../utils/items/cartPlusItem';
import CartRemoveItem from '../../../utils/items/cartRemoveItem';
import { ShoppingBag, PlusSquare } from 'react-feather';

const ItemsArea = ({ category_id, loginstate, title, description }) => {
    /**
    * Блок товаров в каталоге
    */
    const navigate = useNavigate()

    const [listItems, setListItems] = useState([])
    const [isLoaddingItems, setIsLoaddingItems] = useState(true);
    const [orderingPrice, setOrderingPrice] = useState('price_retail');

    const [brandFilters, setBrandsFilters] = useState([])
    const [isLoaddingBrandFilters, setIsLoaddingBrandFilters] = useState(true);
    const [checkedAllBrands, setCheckedAllBrands] = useState(true)

    const [page, setPage] = useState(0);
    const [pageCount, setpageCount] = useState(0);
    const [currentpagestate, setCurrentPageState] = useState(1);
    let currentpage = currentpagestate;

    let items = []

    // Получаем корзину из локального хранилища
    if (localStorage.getItem("items")) {
        items = JSON.parse(localStorage.getItem("items"));
    }

    const getItemsByAuth = (currentpage, category_id) => {
        // Получить товары, в зависимости от статуса авторизации пользователя
        let brands_id = ''
        brandFilters.forEach(object => {
            if (object.checked) {
                brands_id += String(object.id) + ','
            }
        });
        brands_id = brands_id.substring(0, brands_id.length - 1);
        if (loginstate === false) {
            getItems(currentpage, category_id, brands_id);
        } else {
            if (category_id === -1) {
                getItemsOnlyUsers(currentpage)
            } else {
                getItemsAuth(currentpage, category_id, brands_id);
            }
        }
    }

    const getBrandsOnCategory = (category_id) => {
        // Получить список брендов в выбранной категории
        brands_api.getBrandsOnCategory({
            category_id: category_id
        })
            .then(res => {
                let new_res = res
                new_res.forEach(object => {
                    object.checked = true;
                });
                setBrandsFilters(new_res);
                setIsLoaddingBrandFilters(true)
            })
            .catch((e) => console.log(e))
        //.finally(()=> setIsLoaddingItems(false))
    }

    useEffect(() => {
        if (isLoaddingBrandFilters) {
            getBrandsOnCategory(category_id)
        }
    }, [category_id])

    useEffect(() => {

    }, [brandFilters, checkedAllBrands])

    useEffect(() => {
        // Получить все товары при смене категории, загружаем первую страницу
        currentpage = 1;
        setCurrentPageState(1)
        setPage(0)
        getItemsByAuth(currentpage, category_id);
    }, [category_id, orderingPrice, brandFilters])
        ;

    const getItemsOnlyUsers = (page, category_id) => {
        // Получить список категорий товаров пользователя, созданные им
        items_api.getItemsUserPaginate({
            page: page,
            status: '',
        })
            .then(res => {
                setpageCount(Math.ceil(res.count / 8));
                setListItems(res.results);
            })
            .catch((e) => console.log(e))
            .finally(() => setIsLoaddingItems(false))
    }

    const getItems = (page, category_id, brands_id) => {
        // Получить список категорий товаров для всех
        items_api.getItemsFilterCategoryPaginate({
            page: page,
            group: category_id,
            ordering_price: orderingPrice,
            brand: brands_id
        })
            .then(res => {
                setpageCount(Math.ceil(res.count / 8));
                setListItems(res.results);
            })
            .catch((e) => console.log(e))
            .finally(() => setIsLoaddingItems(false))
    }

    const getItemsAuth = (page, category_id, brands_id) => {
        // Получить список категорий товаров для авторизованного пользователя
        items_api.getItemsAuthFilterCategoryPaginate({
            page: page,
            group: category_id,
            ordering_price: orderingPrice,
            brand: brands_id
        })
            .then(res => {
                setpageCount(Math.ceil(res.count / 8));
                setListItems(res.results);
            })
            .catch((e) => console.log(e))
            .finally(() => setIsLoaddingItems(false))
    }

    /**
    * Обработать клик паджинатора
    */
    const handlePageClick = (data) => {
        setPage(data.selected + 1)
        currentpage = data.selected + 1;
        setCurrentPageState(data.selected + 1)
        getItemsByAuth(currentpage, category_id);
    };

    /**
    * Проверяем количество товара, если товар в корзине
    */
    const CheckCartQuantity = (cart, id_item) => {
        var index
        for (index = 0; index < cart.length; ++index) {
            if (id_item === cart[index].id) {
                return Number(cart[index].amount)
            }
        }
        return 1
    }

    const checkStatesCheckedInBrands = (brands_for_check) => {
        // Проверка все ли бренды отмечены
        let allChecked = true
        brands_for_check.forEach(object => {
            if (object.checked === false) {
                allChecked = false
            }
        });
        return allChecked
    }

    const HandleChangeCheckedBrandFilter = (e, id) => {
        // Меняет свойство чекбокса на противоположное и записывает в стейт
        e.preventDefault();
        let brands = brandFilters
        let current_brand = brands.find(brand => brand.id === id)
        if (current_brand.checked === true) { current_brand.checked = false } else { current_brand.checked = true }
        let currentToPush = [];
        brands.forEach(object => {
            currentToPush.push(object);
        });
        setBrandsFilters(currentToPush);
        setCheckedAllBrands(checkStatesCheckedInBrands(brands));
    }

    const HandleChangeBrandAllFilter = (e) => {
        // Логика чек-бокса все бренды
        e.preventDefault();
        let brands = brandFilters
        let allChecked = checkStatesCheckedInBrands(brands)
        let new_value = true
        if (allChecked) {
            new_value = false
        }
        let currentToPush = [];
        brands.forEach(object => {
            object.checked = new_value
            currentToPush.push(object);
        });
        setBrandsFilters(currentToPush);
        setCheckedAllBrands(new_value);
    }

    const CartPlusItemWithRefresh = (results, items_input, e) => {
        // Добавляем элемент в список товаров/услуг с рефрешем
        CartPlusItem(results, items_input, e)
        getItemsByAuth(currentpage, category_id);
    }

    const CartRemoveItemWithRefresh = (id_item, items_input, e) => {
        // Удаляем элемент из списка товаров/услуг по id товара
        CartRemoveItem(id_item, items_input, e)
        getItemsByAuth(currentpage, category_id);
    }

    const CreateItem = (e) => {
        e.preventDefault();
        return navigate("/profile/items/create")
    }

    return (
        <div className="col">
            <div className="d-flex">
                {isLoaddingItems && <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </div>}
            </div>

            <div className="container-fluid">
                <div className="row my-2 ps-2">
                    <h4 className="col-6 p-0">{title}</h4>
                    {category_id === -1 && <div className="col-6 p-0">
                        <div className="form-group mb-0 me-0"></div><button onClick={(e) => CreateItem(e)} className='btn btn-primary btn-create-small' type="button"><PlusSquare size={16} className='me-2' />Добавить</button>
                    </div>}
                </div>
                <div className="row my-2 ps-2">
                    <span className="p-0">{description}</span>
                </div>
                <div className='pb-4'>
                    <select className="form-select" value={orderingPrice} aria-label="Выберите сортировку" onChange={(e) => setOrderingPrice(e.target.value)}>
                        <option value="price_retail">Сортировать по цене по возрастанию</option>
                        <option value="-price_retail">Сортировать по цене по убыванию</option>
                    </select>
                </div>
                <div className='row pb-2'>
                    {brandFilters && brandFilters.length > 0 && <span>
                        <div className='form-check checkbox-brands'>
                            <input type='checkbox' className='form-check-input' id='all_brands' checked={checkStatesCheckedInBrands(brandFilters)} onClick={(e) => HandleChangeBrandAllFilter(e)}></input>
                            <label className='form-check-label pe-2' for='all_brands'> Все бренды</label>
                        </div>
                        {brandFilters.map((results) => {
                            return (
                                <div className='form-check checkbox-brands'>
                                    <input type='checkbox' className='form-check-input' checked={results.checked
                                        ? true
                                        : false} id={results.id} onClick={(e) => HandleChangeCheckedBrandFilter(e, results.id)}></input>
                                    <label className='form-check-label pe-2' for={results.id}>{results.title}</label>
                                </div>
                            )
                        })}
                    </span>}
                </div>
                <div className="row justify-content-start">
                    {listItems.map((results) => {
                        return (
                            <div className="col-12 col-lg-6 col-xl-4 col-xxl-3 mb-5">
                                <div className="card h-100 general-item">
                                    <div className="card-body p-0 item-center">
                                        <div className='area-img'>
                                            {results.image && <img className="card-image" src={results.image} />}
                                        </div>
                                        <div className="text-start">
                                            <div className="ps-2">{results.title}</div>
                                            {results.item_type === "product" && <div className='item-brand ps-2'>Производитель: <b>{results.brand}</b></div>}
                                            <div className='description-item pt-1'>{AddNewTable(results.description)}</div>

                                        </div>
                                    </div>
                                    <div className='item-bottom'>
                                        <div className='item-price pe-2'>{results.price_retail} руб.</div>
                                        {loginstate && <div className="card-footer d-flex p-2 pt-0 border-top-0 bg-transparent">
                                            {CheckSameCartItem(results.id, items)
                                                ? <div className="justify-content-start text-start col-8"><Link to="/profile/offer/create"><button className="btn btn-primary btn-sm">Перейти в <ShoppingBag size={16} color='#FFFFFF' /></button></Link></div>
                                                : <div className="justify-content-start text-start col-8"><button onClick={(e) => CartPlusItemWithRefresh(results, items, e)} className="btn btn-light btn-sm">Добавить в <ShoppingBag size={16} color='#000000' /></button></div>}
                                            <div className="justify-content-end text-end col-4">
                                                {CheckSameCartItem(results.id, items) &&
                                                    <span>
                                                        {/* {CheckCartQuantity(items, results.id)} Шт. */}
                                                        <button className="btn btn-danger btn-sm ms-2" onClick={(e) => CartRemoveItemWithRefresh(results.id, items, e)}>X</button>
                                                    </span>}
                                            </div>
                                        </div>}
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <ReactPaginate
                previousLabel={"предыдущая"}
                nextLabel={"следующая"}
                initialPage={page}
                forcePage={currentpage - 1}
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
        </div>
    );
};

export default ItemsArea;