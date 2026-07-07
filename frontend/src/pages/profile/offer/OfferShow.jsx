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

  const DownloadTorg12Doc = (e) => {
    /**
    * Скачать накладную doc
    */
    e.preventDefault();
    offer_api.downloadTorg12Doc({
      id: id,
    })
    .then(res => {
      console.log(res)
    })
    .catch((e) => console.log(e))
  }

  if (isLoadding) {
    return <div className="offer-show"><p className="text-center my-5">Загрузка...</p></div>
  }

  return (
      <div className="offer-show">

      <div className="row my-2 align-items-center">
          <div className="col-2 text-start py-0 col-height">
              <BackwardButton />
          </div>
          <div className="col-10 text-end pe-4">
              <h5>Просмотр КП {clientInfo?.title && <span>для компании {clientInfo.title}</span>}</h5>
          </div>
      </div>

      <div className="card mb-3">
        <div className="card-body py-2">
          <div className="row">
            <div className="col-5 col-sm-4 text-muted small">Название:</div>
            <div className="col-7 col-sm-8 fw-semibold">{currentOffer.name_offer}</div>
          </div>
          <div className="row">
            <div className="col-5 col-sm-4 text-muted small">Компания:</div>
            <div className="col-7 col-sm-8">{clientInfo ? `${ReadCompanyType(clientInfo.company_type)} ${clientInfo.title}` : '—'}</div>
          </div>
          <div className="row">
            <div className="col-5 col-sm-4 text-muted small">ИНН:</div>
            <div className="col-7 col-sm-8">{clientInfo ? clientInfo.inn : '—'}</div>
          </div>
          <div className="row">
            <div className="col-5 col-sm-4 text-muted small">Адрес:</div>
            <div className="col-7 col-sm-8">{clientInfo ? clientInfo.address_reg : '—'}</div>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body py-1 px-3">
          <div className="d-flex flex-wrap gap-2">
            <div className="d-flex align-items-center flex-wrap gap-1">
              <span className="text-muted small fw-medium">Счета:</span>
              <button onClick={(e) => DownloadBillWork(e)} type="button" className="btn-create btn-create-small" style={{ float: 'none', marginRight: 0, fontSize: '0.78rem' }}><FileText size={14} className='me-1'/>Работы</button>
              <button onClick={(e) => DownloadBillItems(e)} type="button" className="btn-create btn-create-small" style={{ float: 'none', marginRight: 0, fontSize: '0.78rem' }}><FileText size={14} className='me-1'/>Товары</button>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-1">
              <span className="text-muted small fw-medium">КП:</span>
              <button onClick={(e) => DownloadOfferDoc(e)} type="button" className="btn-create btn-create-small" style={{ float: 'none', marginRight: 0, fontSize: '0.78rem' }}><FileText size={14} className='me-1'/>Короткое</button>
              <button onClick={(e) => DownloadOfferDocWithDescription(e)} type="button" className="btn-create btn-create-small" style={{ float: 'none', marginRight: 0, fontSize: '0.78rem' }}><FileText size={14} className='me-1'/>С характеристиками</button>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-1">
              <span className="text-muted small fw-medium">Договоры:</span>
              <button onClick={(e) => DownloadContractItemsDoc(e)} type="button" className="btn-create btn-create-small" style={{ float: 'none', marginRight: 0, fontSize: '0.78rem' }}><FileText size={14} className='me-1'/>На товары</button>
              <button onClick={(e) => DownloadContractServiceDoc(e)} type="button" className="btn-create btn-create-small" style={{ float: 'none', marginRight: 0, fontSize: '0.78rem' }}><FileText size={14} className='me-1'/>На услуги</button>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-1">
              <span className="text-muted small fw-medium">Накладная:</span>
              <button onClick={(e) => DownloadTorg12Doc(e)} type="button" className="btn-create btn-create-small" style={{ float: 'none', marginRight: 0, fontSize: '0.78rem' }}><FileText size={14} className='me-1'/>Торг-12</button>
            </div>
          </div>
        </div>
      </div>
        
      <div className="">
      {itemsOffer.map((results) => {
              return (
                <div className="card mb-3">
                    <div className="card-body px-0 py-0">
                        <div className="row">
                          <div className="col-md-8 row align-items-center">
                            {results.image && <div className="col-4 item-row">
                                <img className='img-responsive-item ms-1' src={results.image} alt="item_img"></img>
                            </div>}
                            <div className="col-8 text-start">
                                <h6 className='p-2 pb-0'>{results.item}</h6>
                            </div>
                          </div>
                          <div className="col-md-4 text-end row align-items-center">
                                <div className='col-12'><h6 className="mb-0 fs-6"><span className='fw-normal'>{results.amount}</span> х {results.item_price_retail} Р.</h6></div>
                          </div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      <div className="d-flex justify-content-between text-start">
                      <p className="mb-2">Итого стоимость оборудования:</p>
                      <p className="mb-1">{currentOffer.final_price_goods} Р.</p>
      </div>
      <div className="d-flex justify-content-between mb-1 text-start">
                      <p className="mb-2">Итого стоимость монтажных работ:</p>
                      <p className="mb-1">{currentOffer.final_price_work} Р.</p>
      </div>
      <div className="d-flex justify-content-between text-start">
                      <p className="mb-2">Итого(без НДС)</p>
                      <p className="mb-1 fs-4">{currentOffer.final_price} Р.</p>
      </div>
      </div>
  );
};

export default OfferShow;
