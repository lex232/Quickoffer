import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import OfferForm from '../../../components/forms/offer/OfferForm';
import offer_api from '../../../api/offer_api';
import TitleSections from '../../../components/titles/titleSections';


const OfferEdit = () => {
  /**
  * Редактирование КП
  */

  const {state} = useLocation();
  const {id} = state;

  const [currentOffer, setCurrentOffer] = useState([]);
  const [nameOffer, setOfferName] = useState([]);
  const [statusOffer, setStatusOffer] = useState([]);
  const [itemsOffer, setItemsOffer] = useState([]);
  const [clientInfo, setClientInfo] = useState([]);
  const [isLoadding, setIsLoadding] = useState(true);

  useEffect(() => {
    // Получить все новости при загрузке страницы
    getCurrentOffer(id);
  }, []);

  const getCurrentOffer = (id) => {
    offer_api.getCurrentOffer({
      id: id,
    })
    .then(res => {
      setCurrentOffer(res)
      setOfferName(res.name_offer)
      setStatusOffer(res.status_type)
      setItemsOffer(res.items_for_offer)
      setClientInfo(res.name_client)
    })
    .catch((e) => console.log(e))
    .finally(()=> setIsLoadding(false))
}

  if (isLoadding === true) {
    return <div className="">Loading...</div>
  }

  let prepareToAddList = []
  for (const item of itemsOffer) {
    prepareToAddList.push({
          id: item.item_id,
          title: item.item,
          item_price_retail: item.item_price_retail,
          item_price_purchase: item.item_price_purchase,
          amount: item.amount,
          description: item.description ,
          image: item.image,
        })
  }
  if (prepareToAddList) {
    localStorage.setItem("items", JSON.stringify(prepareToAddList));
  }
  

  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">
      
      <TitleSections title={'Редактировать КП'}/>
      <div class="col-md-12 project-list">
        <div class="card-header">
          <div className="card-body">
          <div className="col-lg-12 col-md-9 col-sm-11 text-start"><OfferForm id={id} name_offer={nameOffer} status_type={statusOffer}/></div>
          </div>
        </div>
      </div>  
    </main>
  );
};

export default OfferEdit;