import React from 'react';

import ItemForm from '../../../components/forms/items/ItemsForm';
import TitleSections from '../../../components/titles/titleSections';

const ItemsCreate = () => {
  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">
      
      <TitleSections title={'Создать товар/ услугу'}/>
      <div className="col-md-12 project-list">
        <div className="card-header">
          <div className="card-body pt-2">
            <div className="col-lg-6 col-md-9 col-sm-11 text-start mx-0"><ItemForm /></div>
          </div>
        </div>
      </div> 
    </main>
  );
};

export default ItemsCreate;