import React from 'react';

import OfferForm from '../../../components/forms/offer/OfferForm';
import TitleSections from '../../../components/titles/titleSections';

const OfferCreate = () => {
  /**
  * Создание КП
  */

  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">
      
      <TitleSections title={'Создать КП'}/>
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