import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import offer_api from '../../../api/offer_api';
import ReadCompanyType from '../../../utils/text-operations/replaceClientType';


const OfferShow = () => {
  /**
  * Отображение КП
  */
  const navigate = useNavigate()
  const {state} = useLocation();
  const {id} = state;

  const [currentOffer, setCurrentOffer] = useState([]);
  const [itemsOffer, setItemsOffer] = useState([]);
  const [clientInfo, setClientInfo] = useState([]);
  const [isLoadding, setIsLoadding] = useState(true);

  useEffect(() => {
    // Получить все новости при загрузке страницы
    getCurrentOffer(id);
  }, [])
  ;

  const getCurrentOffer = (id) => {
    offer_api.getCurrentOffer({
      id: id,
    })
    .then(res => {
      setCurrentOffer(res);
      setItemsOffer(res.items_for_offer);
      setClientInfo(res.name_client);
    })
    .catch((e) => console.log(e))
    .finally(()=> setIsLoadding(false))
}

  const DownloadOffer = (e) => {
    /**
    * Скачать КП в pdf
    */
    e.preventDefault();
    offer_api.downloadOffer({
      id: id,
    })
    .then(res => {
      console.log(res)
    })
    .catch((e) => console.log(e))
  }

  const DownloadBillWork = (e) => {
    /**
    * Скачать счет на работы
    */
    e.preventDefault();
    offer_api.downloadBillWork({
      id: id,
    })
    .then(res => {
      console.log(res)
    })
    .catch((e) => console.log(e))
  }

  const DownloadBillItems = (e) => {
    /**
    * Скачать счет на товары
    */
    e.preventDefault();
    offer_api.downloadBillItems({
      id: id,
    })
    .then(res => {
      console.log(res)
    })
    .catch((e) => console.log(e))
  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-5">
      <div className="d-flex">
          {isLoadding && <div className="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>}
      </div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center ps-4 pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Просмотр КП {clientInfo && <span>для компании {clientInfo.title}</span>}</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button onClick={(e) => DownloadBillWork(e)} type="button" className="btn btn-sm btn-outline-secondary">Счет (работы)</button>
            <button onClick={(e) => DownloadBillItems(e)} type="button" className="btn btn-sm btn-outline-secondary">Счет (товары)</button>
            <button onClick={(e) => DownloadOffer(e)} type="button" className="btn btn-sm btn-outline-secondary">Скачать PDF</button>
          </div>
        </div>
      </div>
      <table>
        <td className='text-start'>
            <tr>Название коммерческого предложения:</tr>
            <tr>КП для компании:</tr>
            <tr>ИНН:</tr>
            <tr>Адрес регистрации:</tr>
          </td>
          {clientInfo && <td className='text-start ps-4 pb-4'>
            <tr>{currentOffer.name_offer}</tr>
            <tr>{ReadCompanyType(clientInfo.company_type)} {clientInfo.title}</tr>
            <tr>{clientInfo.inn}</tr>
            <tr>{clientInfo.address_reg}</tr>
          </td>}
      </table>
      <div className="table-responsive">
      {itemsOffer.map((results) => {
              return (
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-row align-items-center">
                              <div>
                                { results.image && <img src={results.image} height={80} width={80} alt="item_img"></img>}
                              </div>
                            <div class="ms-3">
                                <h5>{results.item}</h5>
                                <p class="small mb-0"></p>
                            </div>
                            </div>
                            <div class="d-flex flex-row align-items-center">
                            <div>
                                <h5 class="fw-normal mb-0">{results.amount} х</h5>
                            </div>
                            <div>
                                <h5 class="mb-0 ps-2 fs-5">{results.item_price_retail} Р.</h5>
                            </div>
                            <a href="#!"><i class="fas fa-trash-alt"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      <div class="d-flex justify-content-between">
                      <p class="mb-2">Итого стоимость оборудования:</p>
                      <p class="mb-1">{currentOffer.final_price_goods} Р.</p>
      </div>
      <div class="d-flex justify-content-between mb-1">
                      <p class="mb-2">Итого стоимость монтажных работ:</p>
                      <p class="mb-1">{currentOffer.final_price_work} Р.</p>
      </div>
      <div class="d-flex justify-content-between">
                      <p class="mb-2">Итого(без НДС)</p>
                      <p class="mb-1 fs-4">{currentOffer.final_price} Р.</p>
      </div>
    </main>
  );
};

export default OfferShow;
