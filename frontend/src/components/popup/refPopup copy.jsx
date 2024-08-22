import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/popup.css'

const SimplePopup = ({ refPopup, heading, text }) => {

    return (
        <div>
           <Popup ref={refPopup} contentStyle={{width: "350px", className: "modal"}}>
                <div>{heading}: </div>
                <div>{text}</div>
            </Popup>
        </div>
    );
};

export default SimplePopup;
