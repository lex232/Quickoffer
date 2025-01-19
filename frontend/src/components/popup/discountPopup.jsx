import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../../css/popup.css'

import { Percent } from 'react-feather'

const DiscountPopup = ({ text, action, index, key_change }) => {
    /**
     * Popup окно скидочное
     */

    const valuesDiscount = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 100]

    return (
        <div>
            <Popup
                trigger={<span className="ps-2" role="button"><Percent strokeWidth={2} size={24} color="#5c61f2"/></span>}
                position="bottom right"
                closeOnDocumentClick
            >
                <span> { text } </span>
                <div className='btn-sm btn-block'>
                    {valuesDiscount.map((item) => {
                        return(
                            <button type='button' className='col-6 btn btn-outline-secondary' onClick={(e) => {action(index, key_change, e, 'purchase_discount', item);}}>
                                {item} %
                            </button>
                        )
                    })}
                </div>
            </Popup>
        </div>
    );
};

export default DiscountPopup;
