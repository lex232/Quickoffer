import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ItemForm from '../../../components/forms/items/ItemsForm';
import { useLocation } from 'react-router-dom';

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
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <h4 className="h4 mt-3 mb-2 fw-normal text-start">Редактировать товар/ услугу "{title}"</h4>
            <div className="col-lg-7 col-md-9 col-sm-11 text-start mx-3"><ItemForm 
            id={id}
            title={title}
            brand={brand}
            group={group[0]}
            price_retail={price_retail}
            item_type={item_type}
            quantity_type={quantity_type}
            description={description}
            image={image}/></div>
        </main>
    );
};

export default ItemsEdit;
