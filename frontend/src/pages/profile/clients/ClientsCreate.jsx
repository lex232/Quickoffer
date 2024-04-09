import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ClientForm from '../../../components/forms/clients/ClientForm';

const ClientCreate = () => {
  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <h4 className="h4 mt-3 mb-2 fw-normal text-start">Создать организацию/ клиента</h4>
          <div className="col-lg-6 col-md-9 col-sm-11 text-start mx-3"><ClientForm /></div>
    </main>
  );
};

export default ClientCreate;