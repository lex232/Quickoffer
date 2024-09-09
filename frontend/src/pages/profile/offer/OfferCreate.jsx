import React, { useEffect, useState } from 'react';

import OfferForm from '../../../components/forms/offer/OfferForm';
import TitleSections from '../../../components/titles/titleSections';

const OfferCreate = () => {
  /**
  * Создание/ Редактирование КП
  */

  // статус редактирования КП
  const [ title_for_header, setTitleHeader ] = useState('Создать КП')

  // UseEffect проверяет статус КП при загрузке страницы
  useEffect(_ => {
    let editable = localStorage.getItem('editable')
    if (editable) {
      setTitleHeader('Редактировать КП')
    }
  }, []);

  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">
      
      <TitleSections title={title_for_header}/>
      <div class="col-md-12 project-list">
        <div class="card-header">
          <div className="card-body px-3">
            <div className="col-lg-12 col-md-9 col-sm-11 text-start px-0 my-0"><OfferForm /></div>
            </div>
        </div>
      </div>  
    </main>
  );
};

export default OfferCreate;