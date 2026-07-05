import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ReactPaginate from "react-paginate";

import offer_api from '../../../api/offer_api';
import DeletePopup from '../../../components/popup/DeletePopup';
import CreateOfferPopup from '../../../components/popup/CreateOfferPopup';
import getDate from '../../../utils/getDate';

import { AlertTriangle, Eye, Edit3, Trash2, Target, CheckCircle, PenTool, Mail, Loader, Table, PlusSquare, User, Calendar, X } from 'react-feather'
import './styles.css'

const OfferDashboard = () => {
  /**
  * Страница со списком КП
  */

  const navigate = useNavigate()

  const [offers, setOffers] = useState([]);
  const [isLoadding, setIsLoadding] = useState(true);
  const [status, setStatus] = useState('');

  const [page, setPage] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  const [pendingEditId, setPendingEditId] = useState(null);
  let currentpage = 1;

  useEffect(() => {
    // Получить все КП при загрузке страницы
    getOffers(currentpage, status);
  }, []);

  useEffect(() => {
    // Получить все КП при смене типа КП
    getOffers(currentpage, status);
  }, [status]);

  const getOffers = (page, status) => {
    offer_api.getOfferPaginate({
      page: page,
      status: status,
    })
      .then(res => {
        setpageCount(Math.ceil(res.count / 10));
        setOffers(res.results);
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoadding(false))
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
    localStorage.removeItem("items")
    localStorage.removeItem("nameoffer")
    localStorage.removeItem("editable")
    localStorage.removeItem("nameclient")
    window.dispatchEvent(new Event("storage"));
    return navigate("/profile/offer/create/")
  }

  const HandleShowOffer = async (id, e) => {
    e.preventDefault();
    return navigate("show", { state: { id: id } })
  }

  /**
  * Блок загрузки КП на редактирование
  */

  async function getCurrentOffer(id) {
    const data_from_api = offer_api.getCurrentOffer({ id })
    let temp_res = await data_from_api
    return temp_res
  }

  const HandleEditOffer = async (id, e) => {
    /**
    * Редактирование КП - загрузка информации в локал сторейдж
    */

    if (id === undefined) {
      return
    }

    e.preventDefault();

    const hasDraft = localStorage.getItem("items") && JSON.parse(localStorage.getItem("items")).length > 0;
    if (hasDraft) {
      setPendingEditId(id);
      return;
    }

    proceedEditOffer(id);
  }

  const proceedEditOffer = async (id) => {
    setPendingEditId(null);
    localStorage.removeItem('items')
    localStorage.removeItem("nameoffer")
    localStorage.removeItem("editable")

    let result_api = await getCurrentOffer(id);

    let prepareToAddList = []
    for (const item of result_api.items_for_offer) {
      prepareToAddList.push({
        id: item.item_id,
        title: item.item,
        item_price_retail: item.item_price_retail,
        item_price_purchase: item.item_price_purchase,
        amount: item.amount,
        description: item.description,
        image: item.image,
      })
    }
    if (prepareToAddList) {
      localStorage.setItem("items", JSON.stringify(prepareToAddList));
      localStorage.setItem("nameoffer", result_api.name_offer);
      if (result_api.name_client) {
        localStorage.setItem("nameclient", JSON.stringify({
          title: result_api.name_client.title,
          id: result_api.name_client.id
        }));
      }
      localStorage.setItem("editable", id);
      window.dispatchEvent(new Event("storage"));
      return navigate("/profile/offer/create/")
      // result_api.name_client.title
    }

  }

  const HandleDelOffer = async (id) => {
    await offer_api.deleteOffer({ offer_id: id, })
      .then(res => {
        console.log(res)
      })
    getOffers(currentpage, status);
  }

  return (
    <main className="profile-body">

      <div className="container-fluid">
        <div className="page-title">
          <div className="row">
            <div className="col my-3 text-start ps-4">
              <h3>Список коммерческих предложений</h3>
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
                  <li className="nav-item"><a className={'nav-link' + (status === '' ? ' active' : '')} onClick={(e) => handleChangeStatusType(e, '')}><Target />Все</a></li>
                  <li className="nav-item"><a className={'nav-link' + (status === 'in_edit' ? ' active' : '')} onClick={(e) => handleChangeStatusType(e, 'in_edit')}><PenTool />Редактирование</a></li>
                  <li className="nav-item"><a className={'nav-link' + (status === 'in_process' ? ' active' : '')} onClick={(e) => handleChangeStatusType(e, 'in_process')}><Mail />Отправлено</a></li>
                  <li className="nav-item"><a className={'nav-link' + (status === 'in_prepayment' ? ' active' : '')} onClick={(e) => handleChangeStatusType(e, 'in_prepayment')}><Table />Выставлен счет</a></li>
                  <li className="nav-item"><a className={'nav-link' + (status === 'in_install' ? ' active' : '')} onClick={(e) => handleChangeStatusType(e, 'in_install')}><Loader />В работе</a></li>
                  <li className="nav-item"><a className={'nav-link' + (status === 'in_payment' ? ' active' : '')} onClick={(e) => handleChangeStatusType(e, 'in_payment')}><CheckCircle />Выполнен</a></li>
                </ul>
              </div>
              <div className="col-md-3 p-0">
                <div className="form-group mb-0 me-0"></div>
                {(localStorage.getItem("items") && JSON.parse(localStorage.getItem("items")).length > 0) ? <CreateOfferPopup action={CreateOffer} />
                  : <button onClick={(e) => CreateOffer(e)} className='btn btn-primary btn-create' type="button"><PlusSquare size={16} className='me-2' />Создать КП</button>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex">
        {isLoadding && <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>}
      </div>

      <div className="col-md-12 project-list">
        <div className="card-header">
          <div className="mt-3">
            {offers.map((results) => {
              return (
                <div className="row text-start my-2 mx-0" key={results.id}>
                  <div className="col-10 my-0 mx-0">
                    <div className="row my-0 mx-0">
                      <div className="col-md-4">
                        <label><b>{results.name_offer}</b></label>
                      </div>
                      <div className="col-md-4">
                        {results.name_client && <><label><User size='16px' color='gray' /> {results.name_client}</label><br></br></>}
                        {results.created && <label><Calendar size='16px' color='gray' /> {getDate(results.created)}</label>}
                      </div>
                      <div className="col-md-4">
                        <label>Итого: {results.final_price} руб
                          <br></br>Оборудование: {results.final_price_goods} руб
                          <br></br>Работы: {results.final_price_work} руб</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-2 my-0 mx-0 d-flex gap-1 justify-content-end">
                    <button className="action-btn" onClick={(e) => HandleShowOffer(results.id, e)}><Eye size={18} color="#3b82f6" /></button>
                    <button className="action-btn" onClick={(e) => HandleEditOffer(results.id, e)}><Edit3 size={18} color="#f59e0b" /></button>
                    <DeletePopup InputIcon={Trash2} color="#e53e3e" name={results.name_offer} action={HandleDelOffer} id={results.id} />
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

      <Popup
        open={!!pendingEditId}
        modal
        closeOnDocumentClick
        onClose={() => setPendingEditId(null)}
        contentStyle={{ width: 'auto', maxWidth: 380, padding: 0, border: 'none', borderRadius: 16 }}
      >
        <div className="delete-popup">
          <button className="delete-popup-close" onClick={() => setPendingEditId(null)}><X size={18} /></button>
          <div className="delete-popup-icon">
            <AlertTriangle size={32} color="#e53e3e" />
          </div>
          <h3 className="delete-popup-title">Черновик будет удалён</h3>
          <p className="delete-popup-text">Вы уже редактируете другое КП. Загрузка нового удалит текущий черновик.</p>
          <div className="delete-popup-actions">
            <button className="delete-popup-btn delete-popup-btn--danger" onClick={() => proceedEditOffer(pendingEditId)}>
              Загрузить
            </button>
            <button className="delete-popup-btn delete-popup-btn--cancel" onClick={() => setPendingEditId(null)}>
              Отмена
            </button>
          </div>
        </div>
      </Popup>
    </main>
  );
};

export default OfferDashboard;
