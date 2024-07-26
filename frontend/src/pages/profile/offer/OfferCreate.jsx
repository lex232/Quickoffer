import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import OfferForm from '../../../components/forms/offer/OfferForm';

const OfferCreate = () => {
  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">
      
      <div class="container-fluid">
        <div class="page-title">
          <div class="row">
            <div class="col-sm-6 my-3 text-start ps-4">
              <h3>Создать КП</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-12 project-list">
        <div class="card-header">
          <div className="card-body">
          <div className="col-lg-12 col-md-9 col-sm-11 text-start"><OfferForm /></div>
          </div>
        </div>
      </div>  
    </main>
  );
};

export default OfferCreate;