import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from "react-paginate";

import api from '../../../api';
import getDate from '../../../utils/getDate';
import DeletePopup from '../../../components/popup/DeletePopup';

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
    getNews(currentpage);
  }, [])
  ;

  const getNews = (page) => {
    api.getNews({
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
    getNews(currentpage);
  };

  const HandleDelNews = async (id) => {
    await api.deleteNews({ news_id: id, })
      .then(res => {
        console.log(res)
      })
    await getNews(currentpage);
  }

  const HandleEditNews = async (id, title, description, image, e) => {
    e.preventDefault();
    return navigate("edit", {state: {id: id, title: title, description: description, image: image}})
  }

  const CreateNews = (e) => {
    e.preventDefault();
    return navigate("create")
  }
  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Панель Управления</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button onClick={(e) => CreateNews(e)} type="button" className="btn btn-sm btn-outline-secondary">Добавить новость</button>
          </div>
        </div>
      </div>
      <h3>Список новостей</h3>
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
                    <DeletePopup InputIcon={DeleteIco} color="red" name={results.title} action={HandleDelNews} id={results.id}/>
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
