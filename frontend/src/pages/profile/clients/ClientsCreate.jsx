import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ClientForm from '../../../components/forms/clients/ClientForm';

const ClientCreate = () => {
  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">
      
        <div class="container-fluid">
          <div class="page-title">
            <div class="row">
              <div class="col-sm-6 my-3 text-start">
                <h3>Создать организацию/ клиента</h3>
              </div>
            </div>
          </div>
        </div>      

        <div class="col-md-12 project-list">
          <div class="card-header">
            <div className="card-body">
              <div className="col-lg-6 col-md-9 col-sm-11 text-start mx-3"><ClientForm /></div>
            </div>
          </div>
        </div> 
    </main>
  );
};

export default ClientCreate;