import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-feather'

const BackwardButton = () => {
    const navigate = useNavigate();

    return (
        <button className='btn-create btn-create-small' style={{ float: 'none', marginRight: 0 }} onClick={() => navigate(-1)}><ArrowLeft size={16}/></button>
    );
};

export default BackwardButton;