import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from "react-paginate";

import items_api from '../../../api/items_api';
import DeletePopup from '../../../components/popup/DeletePopup';

import AddToCartButton from '../../../components/cart/AddToCartButton';

import { Edit3, Trash2, Target, ShoppingCart, Tool, PlusSquare, CreditCard, Shield } from 'react-feather'
import './styles.css'


const ItemsDashboard = () => {
  const navigate = useNavigate()

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setpageCount] = useState(0);

  const [status, setStatus] = useState('');

  let currentpage = 1;

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

  const handleCartChange = () => {
    getItems(currentpage, status);
  }

  return (
    <main className="profile-body">

      <div className="container-fluid">
        <div className="page-title">
          <div className="row align-items-center">
            <div className="col my-3 text-start ps-4">
              <h3>Список товаров и услуг</h3>
            </div>
            <div className="col-auto pe-4">
              <button onClick={(e) => CreateItem(e)} className='btn-create' type="button"><PlusSquare size={16} className='me-2' />Добавить</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 project-list">
          <div className="card-header">
            <div className="row">
              <div className="col-12 p-0">
                <ul className="nav nav-tabs border-tab" id="top-tab" role="tablist">
                  <li className="nav-item"><a className={'nav-link' + (status === '' ? ' active' : '')} onClick={(e) => setStatus('')}><Target />Все</a></li>
                  <li className="nav-item"><a className={'nav-link' + (status === 'product' ? ' active' : '')} onClick={(e) => setStatus('product')}><ShoppingCart />Товары</a></li>
                  <li className="nav-item"><a className={'nav-link' + (status === 'service' ? ' active' : '')} onClick={(e) => setStatus('service')}><Tool />Услуги</a></li>
                </ul>
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
                <div className="row text-start my-2 mx-0" key={results.id}>
                  <div className="col-10 my-0 mx-0">

                    <div className="row my-0 mx-0">
                      <div className="col-md-4 mt-1">
                        <label>
                          {results.item_type === 'product' ? <ShoppingCart size='16px' /> : <Tool size='16px' />}
                          <b><span className='ps-2'>{results.title}</span></b></label>
                      </div>
                      <div className="col-md-2 mt-1">
                        <label><CreditCard size='16px' color='gray' /> {results.price_retail} Руб.</label>
                      </div>
                      <div className="col-md-2 mt-1">
                        {results.brand && <label><Shield size='16px' color='gray' /> {results.brand}</label>}
                      </div>
                      <div className="col-md-2 mt-1">
                        {results.group.map((res_groups) => {
                          return (
                            <div>
                              {res_groups.title}
                            </div>
                          )
                        })}
                      </div>
                      <div className="col-md-2 px-0 mt-1">
                        <AddToCartButton results={results} onCartChange={handleCartChange} />
                      </div>

                    </div>
                  </div>
                  <div className="col-2 my-0 mx-0 d-flex gap-1 justify-content-end">
                    <button className="action-btn" onClick={(e) => HandleEditItem(
                      results.id,
                      results.title,
                      results.brand,
                      results.group,
                      results.price_retail,
                      results.item_type,
                      results.quantity_type,
                      results.description,
                      results.image,
                      e)}><Edit3 size={18} color="#f59e0b" /></button>
                    <DeletePopup InputIcon={Trash2} color="#e53e3e" name={results.title} action={HandleDelItem} id={results.id} />
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
