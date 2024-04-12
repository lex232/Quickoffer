import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ItemForm from '../../../components/forms/items/ItemsForm';

const ItemsCreate = () => {
  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <h4 className="h4 mt-3 mb-2 fw-normal text-start">Создать товар</h4>
          <div className="col-lg-6 col-md-9 col-sm-11 text-start mx-3"><ItemForm /></div>
    </main>
  );
};

export default ItemsCreate;