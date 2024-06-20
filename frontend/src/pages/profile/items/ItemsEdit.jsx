import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ItemForm from '../../../components/forms/items/ItemsForm';
import { useLocation } from 'react-router-dom';


/**
* Редактирование товара/ услуги
*/
const ItemsEdit = () => {

    const {state} = useLocation();
    const {
        id,
        title,
        brand,
        group,
        price_retail,
        item_type,
        quantity_type,
        description,
        image,} = state;

    return (
        <main className="col-md-9 col-lg-10 px-md-4 profile-body">
            
            <div className="container-fluid">
                <div className="page-title">
                <div className="row">
                    <div className="col-sm-6 my-3 text-start">
                    <h3>Редактировать товар/ услугу</h3>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-md-12 project-list">
                <div className="card-header">
                    <div className="card-body">
                        <div className="col-lg-7 col-md-9 col-sm-11 text-start mx-3"><ItemForm 
                            id={id}
                            title={title}
                            brand={brand}
                            group={group[0]}
                            price_retail={price_retail}
                            item_type={item_type}
                            quantity_type={quantity_type}
                            description={description}
                            image={image}/>
                        </div>
                    </div>
                </div>
            </div> 
        </main>
    );
};

export default ItemsEdit;
