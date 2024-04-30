import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from "react-paginate";

import clients_api from '../../../api/clients_api';
import getDate from '../../../utils/getDate';

import { ReactComponent as PencilIco } from '../../../static/image/icons/pencil.svg'
import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'


const ClientDashboard = () => {
  const navigate = useNavigate()

  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  let currentpage = 1;

  useEffect(() => {
    // Получить все новости при загрузке страницы
    getClients(currentpage);
  }, [])
  ;

  const getClients = (page) => {
    clients_api.getClients({
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
    getClients(currentpage);
  };

  const HandleDelClient = async (id) => {
    await clients_api.deleteClient({ news_id: id, })
      .then(res => {
        console.log(res)
      })
    await getClients(currentpage);
  }

  const HandleEditNews = async (id, title, description, image, e) => {
    e.preventDefault();
    return navigate("edit", {state: {id: id, title: title, description: description, image: image}})
  }

  const CreateClient = (e) => {
    e.preventDefault();
    return navigate("/profile/clients/create")
  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Панель Управления</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button onClick={(e) => CreateClient(e)} type="button" className="btn btn-sm btn-outline-secondary">Добавить клиента</button>
          </div>
        </div>
      </div>
      <h3>Список клиентов</h3>
      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Заголовок</th>
              <th scope="col">Дата публикации</th>
              <th scope="col">Редактировать</th>
              <th scope="col">Удалить</th>
            </tr>
          </thead>
          <tbody>
            {news.map((results) => {
              return (
                <tr key={results.id}>
                  <td>{results.id}</td>
                  <td>{results.title}</td>
                  <td>{getDate(results.pub_date)}</td>
                  <td><button onClick={(e) => HandleEditNews(results.id, results.title, results.description, results.image, e)}><PencilIco fill="orange"/></button></td>
                  <td>
                  </td>
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

export default ClientDashboard;
