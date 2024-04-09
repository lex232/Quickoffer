import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import NewsForm from '../../../components/forms/admin/NewsForm';
import { useLocation } from 'react-router-dom';

const ClientsEdit = () => {

    const {state} = useLocation();
    const {id, title, description, image} = state;

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <h4 className="h4 mt-3 mb-2 fw-normal text-start">Редактировать запись "{title}"</h4>
            <div className="col-lg-7 col-md-9 col-sm-11 text-start mx-3"><NewsForm id={id} title={title} description={description} image={image}/></div>
        </main>
    );
};

export default ClientsEdit;
