import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from "react-paginate";

import offer_api from '../../../api/offer_api';
import getDate from '../../../utils/getDate';
import DeletePopup from '../../../components/popup/DeletePopup';

import { ReactComponent as EyeIco } from '../../../static/image/icons/eye_icon.svg'
import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'
import './styles.css'

const OfferDashboard = () => {
  const navigate = useNavigate()

  const [news, setNews] = useState([]);
  const [isLoadding, setIsLoadding] = useState(true);

  const [page, setPage] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  let currentpage = 1;

  useEffect(() => {
    // Получить все новости при загрузке страницы
    getOffers(currentpage);
  }, []);

  const getOffers = (page) => {
    offer_api.getOfferPaginate({
      page: page,
    })
    .then(res => {
      setpageCount(Math.ceil(res.count / 10));
      setNews(res.results);
    })
    .catch((e) => console.log(e))
    .finally(()=> setIsLoadding(false))
}

  const handlePageClick = (data) => {
    // Обработать клик паджинатора
    setPage(data.selected + 1)
    currentpage = data.selected + 1;
    getOffers(currentpage);
  };


  const CreateOffer = (e) => {
    e.preventDefault();
    return navigate("/profile/offer/create/")
  }

  const HandleShowOffer = async (id, e) => {
    e.preventDefault();
    return navigate("show", {state: {id: id}})
  }

  const HandleDelOffer = async (id) => {
    await offer_api.deleteOffer({ offer_id: id, })
      .then(res => {
        console.log(res)
      })
    await getOffers(currentpage);
  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Панель Управления</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button onClick={(e) => CreateOffer(e)} type="button" className="btn btn-sm btn-outline-secondary">Добавить КП</button>
          </div>
        </div>
      </div>
      <h3>Список коммерческих предложений</h3>
      <div className="d-flex">
          {isLoadding && <div className="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>}
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">Заголовок</th>
              <th scope="col">Для клиента</th>
              <th scope="col">Дата создания</th>
              <th className='table_left' scope="col">Сумма</th>
              <th scope="col">Открыть</th>
              <th scope="col">Удалить</th>
            </tr>
          </thead>
          <tbody>
            {news.map((results) => {
              return (
                <tr key={results.id}>
                  <td>{results.name_offer}</td>
                  <td>{results.name_client}</td>
                  <td>{getDate(results.created)}</td>
                  <td className='table_left'>Итого: {results.final_price} руб 
                      <br></br>Оборудование: {results.final_price_goods} руб
                      <br></br>Работы: {results.final_price_work} руб
                  </td>
                  <td><button onClick={(e) => HandleShowOffer(results.id, e)}><EyeIco fill="blue" transform='scale(1)' baseProfile='tiny' width={28} height={28}/></button></td>
                  <td>
                    <DeletePopup InputIcon={DeleteIco} color="red" name={results.name_offer} action={HandleDelOffer} id={results.id}/>
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

export default OfferDashboard;
