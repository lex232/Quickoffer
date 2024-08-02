import React from 'react';

import ClientForm from '../../../components/forms/clients/ClientForm';
import TitleSections from '../../../components/titles/titleSections';

const ClientCreate = () => {
  /**
  * Страница создания клиента пользователя
  */

  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">
        <TitleSections title={'Создать клиента'}/>
        <div className="col-md-12 project-list">
          <div className="card-header">
            <div className="card-body pt-2">
              <div className="col-lg-6 col-md-9 col-sm-11 text-start mx-3"><ClientForm /></div>
            </div>
          </div>
        </div> 
    </main>
  );
};

export default ClientCreate;