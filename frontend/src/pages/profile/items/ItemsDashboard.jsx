import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from "react-paginate";

import clients_api from '../../../api/clients_api';
import items_api from '../../../api/items_api';
import getDate from '../../../utils/getDate';
import DeletePopup from '../../../components/popup/DeletePopup';

import { ReactComponent as PencilIco } from '../../../static/image/icons/pencil.svg'
import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'


const ItemsDashboard = () => {
  const navigate = useNavigate()

  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  let currentpage = 1;

  useEffect(() => {
    // Получить все новости при загрузке страницы
    getItems(currentpage);
  }, [])
  ;

  const getItems = (page) => {
    items_api.getItemsUserPaginate({
      page: page,
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
    getItems(currentpage);
  };

  const HandleDelItem = async (id) => {
    await items_api.deleteItem({ item_id: id, })
      .then(res => {
        console.log(res)
      })
    await getItems(currentpage);
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
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Панель Управления</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button onClick={(e) => CreateItem(e)} type="button" className="btn btn-sm btn-outline-secondary">Добавить товар</button>
          </div>
        </div>
      </div>
      <h3>Список своих товаров/ услуг</h3>
      <div className="table-responsive">
        <table className="table table-striped table-sm">
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
                  <td>{results.item_type}</td>
                  <td>{results.group}</td>
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
    </main>
  );
};

export default ItemsDashboard;
