import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import offer_api from '../../../api/offer_api';


const OfferShow = () => {
  const navigate = useNavigate()
  const {state} = useLocation();
  const {id} = state;

  const [currentOffer, setCurrentOffer] = useState([]);
  const [itemsOffer, setItemsOffer] = useState([]);
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
    })
    .catch((e) => console.log(e))
    .finally(()=> setIsLoadding(false))
}

  const DownloadOffer = (e) => {
    e.preventDefault();
  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex">
          {isLoadding && <div className="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>}
      </div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Просмотр КП для компании {currentOffer.name_client}</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button onClick={(e) => DownloadOffer(e)} type="button" className="btn btn-sm btn-outline-secondary">Скачать PDF</button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
      {itemsOffer.map((results) => {
              return (
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-row align-items-center">
                            <div>
                            <img src={results.image} width="189" height="255" alt="item_img"></img>
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
                                <h5 class="mb-0 ps-2">{results.item_price_retail} Руб.</h5>
                            </div>
                            <a href="#!"><i class="fas fa-trash-alt"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      <div class="d-flex justify-content-between mb-4">
                      <p class="mb-2">Итого(без НДС)</p>
                      <p class="mb-2">$4818.00</p>
                    </div>
    </main>
  );
};

export default OfferShow;
