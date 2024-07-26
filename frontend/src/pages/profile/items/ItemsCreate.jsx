import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ItemForm from '../../../components/forms/items/ItemsForm';

const ItemsCreate = () => {
  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">
      
      <div className="container-fluid">
        <div className="page-title">
          <div className="row">
            <div className="col-sm-6 my-3 text-start ps-4">
              <h3>Создать товар/ услугу</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12 project-list">
        <div className="card-header">
          <div className="card-body">
            <div className="col-lg-6 col-md-9 col-sm-11 text-start mx-3"><ItemForm /></div>
          </div>
        </div>
      </div> 
    </main>
  );
};

export default ItemsCreate;