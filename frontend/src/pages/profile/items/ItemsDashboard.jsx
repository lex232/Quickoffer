import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReactPaginate from "react-paginate";

import items_api from '../../../api/items_api';
import DeletePopup from '../../../components/popup/DeletePopup';

import CartPlusItem from '../../../utils/items/cartPlusItem';
import CartRemoveItem from '../../../utils/items/cartRemoveItem';
import CheckSameCartItem from '../../../utils/items/checkSameCartItem';

import { ReactComponent as PencilIco } from '../../../static/image/icons/pencil.svg'
import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'
import { Target, ShoppingCart, Tool, PlusSquare, CreditCard, Shield, ShoppingBag } from 'react-feather'
import './styles.css'


const ItemsDashboard = () => {
  const navigate = useNavigate()

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setpageCount] = useState(0);

  const [status, setStatus] = useState('');

  let currentpage = 1;

  let items_in_cart = []

  // Получаем корзину из локального хранилища
  if (localStorage.getItem("items")) {
    items_in_cart = JSON.parse(localStorage.getItem("items"));
  }

  useEffect(() => {
    // Получить все товары при загрузке страницы
    getItems(currentpage, status);
  }, []);

  useEffect(() => {
    // Получить все товары при загрузке страницы
    getItems(currentpage, status);
  }, [status]);

  const getItems = (page, status) => {
    items_api.getItemsUserPaginate({
      page: page,
      status: status,
    })
      .then(res => {
        setpageCount(Math.ceil(res.count / 10));
        setItems(res.results);
      })
      .catch((e) => console.log(e))
  }

  const handlePageClick = (data) => {
    // Обработать клик паджинатора
    setPage(data.selected + 1)
    currentpage = data.selected + 1;
    getItems(currentpage, status);
  };

  const HandleDelItem = async (id) => {
    await items_api.deleteItem({ item_id: id, })
      .then(res => {
        console.log(res)
      })
    await getItems(currentpage, status);
  }

  const HandleEditItem = async (
    id,
    title,
    brand,
    group,
    price_retail,
    item_type,
    quantity_type,
    description,
    image,
    e) => {
    e.preventDefault();
    return navigate("/profile/items/edit", {
      state: {
        id: id,
        title: title,
        brand: brand,
        group: group,
        price_retail: price_retail,
        item_type: item_type,
        quantity_type: quantity_type,
        description: description,
        image: image
      }
    })
  }

  const CreateItem = (e) => {
    e.preventDefault();
    return navigate("/profile/items/create")
  }

  const CartPlusItemWithRefresh = (results, items_input, e) => {
    // Добавляем элемент в список товаров/услуг с рефрешем
    CartPlusItem(results, items_input, e)
    getItems(currentpage, status);
  }

  const CartRemoveItemWithRefresh = (id_item, items_input, e) => {
    // Удаляем элемент из списка товаров/услуг по id товара
    CartRemoveItem(id_item, items_input, e)
    getItems(currentpage, status);
  }

  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">

      <div className="container-fluid">
        <div className="page-title">
          <div className="row">
            <div className="col-sm-6 my-3 text-start ps-4">
              <h3>Список товаров и услуг</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 project-list">
          <div className="card-header">
            <div className="row">
              <div className="col-md-9 p-0 d-flex">
                <ul className="nav nav-tabs border-tab" id="top-tab" role="tablist">
                  <li className="nav-item"><a className="nav-link active" id="top-home-tab" data-bs-toggle="tab" href="#top-home" role="tab" aria-controls="top-home" aria-selected="true" onClick={(e) => setStatus('')}><Target />Все</a></li>
                  <li className="nav-item"><a className="nav-link" id="top-items-tab" data-bs-toggle="tab" href="#top-items" role="tab" aria-controls="top-items" aria-selected="false" onClick={(e) => setStatus('product')}><ShoppingCart />Товары</a></li>
                  <li className="nav-item"><a className="nav-link" id="service-top-tab" data-bs-toggle="tab" href="#top-service" role="tab" aria-controls="top-service" aria-selected="false" onClick={(e) => setStatus('service')}><Tool />Услуги</a></li>
                </ul>
              </div>
              <div className="col-md-3 p-0">
                <div className="form-group mb-0 me-0"></div><button onClick={(e) => CreateItem(e)} className='btn btn-primary btn-create' type="button"><PlusSquare size={16} className='me-2' />Добавить</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12 project-list">
        <div className="card-header">
          <div className="mt-3">
            {items.map((results) => {
              return (
                <div class="row text-start my-2 mx-0" key={results.id}>
                  <div class="col-10 my-0 mx-0">

                    <div class="row my-0 mx-0">
                      <div class="col-md-4 mt-1">
                        <label>
                          {results.item_type === 'product' ? <ShoppingCart size='16px' /> : <Tool size='16px' />}
                          <b><span className='ps-2'>{results.title}</span></b></label>
                      </div>
                      <div class="col-md-2 mt-1">
                        <label><CreditCard size='16px' color='gray' /> {results.price_retail} Руб.</label>
                      </div>
                      <div class="col-md-2 mt-1">
                        {results.brand && <label><Shield size='16px' color='gray' /> {results.brand}</label>}
                      </div>
                      <div class="col-md-2 mt-1">
                        {results.group.map((res_groups) => {
                          return (
                            <div>
                              {res_groups.title}
                            </div>
                          )
                        })}
                      </div>
                      <div class="col-md-2 px-0 mt-1">
                        <div className="bg-transparent d-flex flex-row">
                          {CheckSameCartItem(results.id, items_in_cart)
                            ? <div><Link to="/profile/offer/create"><button className="btn btn-primary btn-sm">Перейти в <ShoppingBag size={16} color='#FFFFFF' /></button></Link></div>
                            : <div><button onClick={(e) => CartPlusItemWithRefresh(results, items_in_cart, e)} className="btn btn-light btn-sm">Добавить в <ShoppingBag size={16} color='#000000' /></button></div>}

                          {CheckSameCartItem(results.id, items_in_cart) &&
                            <span>
                              <button className="btn btn-danger btn-sm ms-2 ms-2" onClick={(e) => CartRemoveItemWithRefresh(results.id, items_in_cart, e)}>X</button>
                            </span>}

                        </div>
                      </div>

                    </div>
                  </div>
                  <div class="col-2 my-0 mx-0">
                    <button onClick={(e) => HandleEditItem(
                      results.id,
                      results.title,
                      results.brand,
                      results.group,
                      results.price_retail,
                      results.item_type,
                      results.quantity_type,
                      results.description,
                      results.image,
                      e)}><PencilIco fill="orange" /></button>
                    <DeletePopup InputIcon={DeleteIco} color="red" name={results.title} action={HandleDelItem} id={results.id} />
                  </div>
                  <hr className='mt-2'></hr>
                </div>
              );
            })}

            <ReactPaginate
              previousLabel={"предыдущая"}
              nextLabel={"следующая"}
              initialPage={page}
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
        </div>
      </div>
    </main>
  );
};

export default ItemsDashboard;
