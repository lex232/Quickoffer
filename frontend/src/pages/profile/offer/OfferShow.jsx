import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import offer_api from '../../../api/offer_api';
import ReadCompanyType from '../../../utils/text-operations/replaceClientType';
import BackwardButton from '../../../components/buttons/backwardButton';
import { FileText } from 'react-feather';


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

  const DownloadOfferDoc = (e) => {
    /**
    * Скачать КП в doc
    */
    e.preventDefault();
    offer_api.downloadOfferDoc({
      id: id,
    })
    .then(res => {
      console.log(res)
    })
    .catch((e) => console.log(e))
  }

  const DownloadOfferDocWithDescription = (e) => {
    /**
    * Скачать КП в doc с характеристиками
    */
    e.preventDefault();
    offer_api.downloadOfferDocWithDescription({
      id: id,
    })
    .then(res => {
      console.log(res)
    })
    .catch((e) => console.log(e))
  }

  const DownloadBillWork = (e) => {
    /**
    * Скачать счет на работы doc
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
    * Скачать счет на товары doc
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

  const DownloadContractItemsDoc = (e) => {
    /**
    * Скачать договор на товары doc
    */
    e.preventDefault();
    offer_api.downloadContractItemsDoc({
      id: id,
    })
    .then(res => {
      console.log(res)
    })
    .catch((e) => console.log(e))
  }

  const DownloadContractServiceDoc = (e) => {
    /**
    * Скачать договор на услуги doc
    */
    e.preventDefault();
    offer_api.downloadContractServiceDoc({
      id: id,
    })
    .then(res => {
      console.log(res)
    })
    .catch((e) => console.log(e))
  }

  return (
    <main className="col-md-9 col-lg-10">

      <div className="row my-2 align-items-center">
          <div className="col-2 text-start py-0 col-height">
              <BackwardButton />
          </div>
          <div className="col-10 text-end pe-4">
              <h5>Просмотр КП {clientInfo && <span>для компании {clientInfo.title}</span>}</h5>
          </div>
      </div>

      <table className='mb-3'>
        <tbody>
          <td className='text-start'>
            <tr>Название коммерческого предложения:</tr>
            <tr>КП для компании:</tr>
            <tr>ИНН:</tr>
            <tr>Адрес регистрации:</tr>
          </td>
          {clientInfo && <td className='text-start'>
            <tr>{currentOffer.name_offer}</tr>
            <tr>{ReadCompanyType(clientInfo.company_type)} {clientInfo.title}</tr>
            <tr>{clientInfo.inn}</tr>
            <tr>{clientInfo.address_reg}</tr>
          </td>}
        </tbody>
      </table>

      <div className="row mb-2 text-end pb-2">
          <div className="col">
            <button onClick={(e) => DownloadBillWork(e)} type="button-work" className="btn btn-sm btn-outline-secondary">Счет (работы) <FileText color='#5c61f2' size={18}/></button>
            <button onClick={(e) => DownloadBillItems(e)} type="button-items" className="btn btn-sm btn-outline-secondary">Счет (товары) <FileText color='#5c61f2' size={18}/></button>
            <button onClick={(e) => DownloadOfferDoc(e)} type="button-pdf" className="btn btn-sm btn-outline-secondary">КП <FileText color='#5c61f2' size={18}/></button>
            <button onClick={(e) => DownloadOfferDocWithDescription(e)} type="button-pdf" className="btn btn-sm btn-outline-secondary">КП с характеристиками<FileText color='#5c61f2' size={18}/></button>
            <button onClick={(e) => DownloadContractItemsDoc(e)} type="button-pdf" className="btn btn-sm btn-outline-secondary">Договор (товары) <FileText color='#5c61f2' size={18}/></button>
            <button onClick={(e) => DownloadContractServiceDoc(e)} type="button-pdf" className="btn btn-sm btn-outline-secondary">Договор (услуги) <FileText color='#5c61f2' size={18}/></button>
            {/* <button onClick={(e) => DownloadOffer(e)} type="button-pdf" className="btn btn-sm btn-outline-secondary">КП PDF</button> */}
          </div>
        </div>
        
      <div className="">
      {itemsOffer.map((results) => {
              return (
                <div class="card mb-3">
                    <div class="card-body px-0 py-0">
                        <div class="row">
                          <div class="col-md-8 row align-items-center">
                            {results.image && <div class="col-4 item-row">
                                <img className='img-responsive-item ms-1' src={results.image} alt="item_img"></img>
                            </div>}
                            <div class="col-8 text-start">
                                <h6 className='p-2 pb-0'>{results.item}</h6>
                            </div>
                          </div>
                          <div class="col-md-4 text-end row align-items-center">
                                <div className='col-12'><h6 class="mb-0 fs-6"><span className='fw-normal'>{results.amount}</span> х {results.item_price_retail} Р.</h6></div>
                          </div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      <div class="d-flex justify-content-between text-start">
                      <p class="mb-2">Итого стоимость оборудования:</p>
                      <p class="mb-1">{currentOffer.final_price_goods} Р.</p>
      </div>
      <div class="d-flex justify-content-between mb-1 text-start">
                      <p class="mb-2">Итого стоимость монтажных работ:</p>
                      <p class="mb-1">{currentOffer.final_price_work} Р.</p>
      </div>
      <div class="d-flex justify-content-between text-start">
                      <p class="mb-2">Итого(без НДС)</p>
                      <p class="mb-1 fs-4">{currentOffer.final_price} Р.</p>
      </div>
    </main>
  );
};

export default OfferShow;
