import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import OfferForm from '../../../components/forms/offer/OfferForm';

const OfferCreate = () => {
  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-5">
          <h4 className="h4 mt-3 mb-2 fw-normal text-start">Создать коммерческое предложение</h4>
          <div className="col-lg-12 col-md-9 col-sm-11 text-start"><OfferForm /></div>
    </main>
  );
};

export default OfferCreate;