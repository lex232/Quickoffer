import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from "react-paginate";

import offer_api from '../../../api/offer_api';
import getDate from '../../../utils/getDate';
import DeletePopup from '../../../components/popup/DeletePopup';

import { ReactComponent as EyeIco } from '../../../static/image/icons/eye_icon.svg'
import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'
import { ReactComponent as PencilIco } from '../../../static/image/icons/pencil.svg'
import { Target, CheckCircle, PenTool, Mail, Loader, Table,  PlusSquare } from 'react-feather'
import './styles.css'

const OfferDashboard = () => {
  const navigate = useNavigate()

  const [news, setNews] = useState([]);
  const [isLoadding, setIsLoadding] = useState(true);
  const [status, setStatus] = useState('');

  const [page, setPage] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  let currentpage = 1;

  useEffect(() => {
    // Получить все новости при загрузке страницы
    getOffers(currentpage, status);
  }, []);

  useEffect(() => {
    // Получить все новости при загрузке страницы
    getOffers(currentpage, status);
  }, [status]);

  const getOffers = (page, status) => {
    offer_api.getOfferPaginate({
      page: page,
      status: status,
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
    getOffers(currentpage, status);
  };

  const handleChangeStatusType = (e, val) => {
    e.preventDefault();
    setStatus(val)
  }

  const CreateOffer = (e) => {
    e.preventDefault();
    return navigate("/profile/offer/create/")
  }

  const HandleShowOffer = async (id, e) => {
    e.preventDefault();
    return navigate("show", {state: {id: id}})
  }

  const HandleEditOffer = async (id, e) => {
    e.preventDefault();
    localStorage.removeItem('items')
    return navigate("/profile/offer/edit", {state: {id: id}})
  }

  const HandleDelOffer = async (id) => {
    await offer_api.deleteOffer({ offer_id: id, })
      .then(res => {
        console.log(res)
      })
      getOffers(currentpage, status);
  }

  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">
      
      <div class="container-fluid">
        <div class="page-title">
          <div class="row">
            <div class="col my-3 text-start ps-4">
              <h3>Список коммерческих предложений</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12 project-list">
          <div class="card-header">
            <div class="row">
              <div class="col-md-9 p-0 d-flex">
                <ul class="nav nav-tabs border-tab" id="top-tab" role="tablist">
                  <li class="nav-item"><a class="nav-link active" id="top-home-tab" data-bs-toggle="tab" href="#top-home" role="tab" aria-controls="top-home" aria-selected="true" onClick={(e) => handleChangeStatusType(e, '')}><Target />Все</a></li>
                  <li class="nav-item"><a class="nav-link" id="profile-top-tab" data-bs-toggle="tab" href="#top-profile" role="tab" aria-controls="top-profile" aria-selected="false" onClick={(e) => handleChangeStatusType(e, 'in_edit')}><PenTool />Редактирование</a></li>
                  <li class="nav-item"><a class="nav-link" id="contact-top-tab" data-bs-toggle="tab" href="#top-contact" role="tab" aria-controls="top-contact" aria-selected="false" onClick={(e) => handleChangeStatusType(e, 'in_process')}><Mail />Отправлено</a></li>
                  <li class="nav-item"><a class="nav-link" id="bill-top-tab" data-bs-toggle="tab" href="#top-bill" role="tab" aria-controls="top-bill" aria-selected="false" onClick={(e) => handleChangeStatusType(e, 'in_prepayment')}><Table />Выставлен счет</a></li>
                  <li class="nav-item"><a class="nav-link" id="work-top-tab" data-bs-toggle="tab" href="#top-work" role="tab" aria-controls="top-work" aria-selected="false" onClick={(e) => handleChangeStatusType(e, 'in_install')}><Loader />В работе</a></li>
                  <li class="nav-item"><a class="nav-link" id="done-top-tab" data-bs-toggle="tab" href="#top-done" role="tab" aria-controls="top-done" aria-selected="false" onClick={(e) => handleChangeStatusType(e, 'in_payment')}><CheckCircle />Выполнен</a></li>
                </ul>
              </div>
              <div class="col-md-3 p-0">                    
                <div class="form-group mb-0 me-0"></div><button onClick={(e) => CreateOffer(e)} className='btn btn-primary btn-create' type="button"><PlusSquare size={16} className='me-2' />Добавить КП</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-12 project-list">
        <div class="card-header">
          <div className="card-body">
           
            <div className="d-flex">
              {isLoadding && <div className="spinner-border text-primary" role="status">
                <span class="visually-hidden">Загрузка...</span>
              </div>}
            </div>

            <div className="table-responsive product-table">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Для клиента</th>
                    <th scope="col">Дата создания</th>
                    <th className='table_left' scope="col">Сумма</th>
                    <th scope="col">Действия</th>
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
                        <td>
                          <button onClick={(e) => HandleShowOffer(results.id, e)}><EyeIco fill="blue" transform='scale(1)' baseProfile='tiny' width={28} height={28}/></button>
                          <button onClick={(e) => HandleEditOffer(results.id, e)}><PencilIco fill="orange"/></button>
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

          </div>
        </div>
      </div>


    </main>
  );
};

export default OfferDashboard;
