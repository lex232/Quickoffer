import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { Percent } from 'react-feather'

const DiscountPopup = ({ text, action, index, key_change }) => {
    const valuesDiscount = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]

    return (
        <Popup
            trigger={
                <button className="discount-trigger" type="button" title={text}>
                    <Percent size={12} />
                </button>
            }
            position="bottom right"
            closeOnDocumentClick
            contentStyle={{ width: 220, padding: 0, border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        >
            <div className="discount-popup">
                <div className="discount-popup-label">{text}</div>
                <div className="discount-popup-grid">
                    {valuesDiscount.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className="discount-popup-btn"
                            onClick={(e) => { action(index, key_change, e, 'purchase_discount', item); }}
                        >
                            {item}%
                        </button>
                    ))}
                </div>
            </div>
        </Popup>
    );
};

export default DiscountPopup;
