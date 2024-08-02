import React from 'react';

import { useLocation } from 'react-router-dom';
import ClientForm from '../../../components/forms/clients/ClientForm';
import TitleSections from '../../../components/titles/titleSections';

const ClientsEdit = () => {
    /**
    * Страница редактирования клиента - передаем стейт
    * выбранного клиента для изменения данных
    */

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
        <main className="col-md-9 col-lg-10 px-md-4 profile-body">
            <TitleSections title={'Редактировать клиента'}/>
            <div className="col-md-12 project-list">
                <div className="card-header">
                    <div className="card-body pt-2">           
                        <div className="col-lg-7 col-md-9 col-sm-11 text-start mx-0">
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
                    </div>
                </div>
            </div>        
        </main>
    );
};

export default ClientsEdit;
