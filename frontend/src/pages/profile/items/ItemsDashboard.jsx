import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from "react-paginate";

import items_api from '../../../api/items_api';
import getDate from '../../../utils/getDate';
import DeletePopup from '../../../components/popup/DeletePopup';
import ReadItemType from '../../../utils/text-operations/replaceItemType';

import { ReactComponent as PencilIco } from '../../../static/image/icons/pencil.svg'
import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'
import { Target, ShoppingCart, Tool, PlusSquare } from 'react-feather'
import './styles.css'


const ItemsDashboard = () => {
  const navigate = useNavigate()

  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  
  const [status, setStatus] = useState('');

  let currentpage = 1;

  useEffect(() => {
    // Получить все новости при загрузке страницы
    getItems(currentpage, status);
  }, [])
  ;

  useEffect(() => {
    // Получить все новости при загрузке страницы
    getItems(currentpage, status);
  }, [status]);

  const getItems = (page, status) => {
    items_api.getItemsUserPaginate({
      page: page,
      status: status,
    })
    .then(res => {
      setpageCount(Math.ceil(res.count / 10));
      setNews(res.results);
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
    return navigate("/profile/items/edit", {state: {
      id: id,
      title: title,
      brand: brand,
      group: group,
      price_retail: price_retail,
      item_type: item_type,
      quantity_type: quantity_type,
      description: description,
      image: image}})
  }

  const CreateItem = (e) => {
    e.preventDefault();
    return navigate("/profile/items/create")
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
                <div className="form-group mb-0 me-0"></div><button onClick={(e) => CreateItem(e)} className='btn btn-primary btn-create' type="button"><PlusSquare size={16} className='me-2' />Добавить позицию</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12 project-list">
        <div className="card-header">
          <div className="card-body"></div>

            <div className="table-responsive product-table">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Дата публикации</th>
                    <th scope="col">Бренд</th>
                    <th scope="col">Цена</th>
                    <th scope="col">Тип</th>
                    <th scope="col">Группа</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((results) => {
                    return (
                      <tr key={results.id}>
                        <td>{results.title}</td>
                        <td>{getDate(results.pub_date)}</td>
                        <td>{results.brand}</td>
                        <td>{results.price_retail} руб</td>
                        <td>{ReadItemType(results.item_type)}</td>
                        <td>{results.group.map((res_groups) => {
                          return (
                            <div>
                              {res_groups.title}
                            </div>
                          )})}
                        
                        </td>
                        <td><button onClick={(e) => HandleEditItem(
                          results.id,
                          results.title,
                          results.brand,
                          results.group,
                          results.price_retail,
                          results.item_type,
                          results.quantity_type,
                          results.description,
                          results.image,
                          e)}><PencilIco fill="orange"/></button></td>
                        <td><DeletePopup InputIcon={DeleteIco} color="red" name={results.title} action={HandleDelItem} id={results.id}/></td>
                      </tr>
                      );
                    })}
                </tbody>
              </table>

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
