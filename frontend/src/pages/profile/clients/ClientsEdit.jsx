import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useLocation } from 'react-router-dom';
import ClientForm from '../../../components/forms/clients/ClientForm';

const ClientsEdit = () => {
    // Страница редактирования клиента - передаем стейт
    // выбранного клиента для изменения данных

    const {state} = useLocation();
    const {
        id,
        title,
        company_type,
        ogrn,
        inn,
        kpp,
        address_reg,
        address_post,
        bill_num,
        bill_corr_num,
        bank_name,
        phone_company,
        image,
    } = state;

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <h4 className="h4 mt-3 mb-2 fw-normal text-start">Редактировать клиента "{title}"</h4>
            <div className="col-lg-7 col-md-9 col-sm-11 text-start mx-3">
                <ClientForm 
                    id={id}
                    title={title}
                    company_type={company_type}
                    ogrn={ogrn}
                    inn={inn}
                    kpp={kpp}
                    address_reg={address_reg}
                    address_post={address_post}
                    bill_num={bill_num}
                    bill_corr_num={bill_corr_num}
                    bank_name={bank_name}
                    phone_company={phone_company}
                    image={image}/>
            </div>
        </main>
    );
};

export default ClientsEdit;
