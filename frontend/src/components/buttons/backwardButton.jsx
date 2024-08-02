import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from 'react-feather'

const BackwardButton = () => {
    const navigate = useNavigate();

    return (
        <button className='btn btn-primary btn-sm ms-3 me-3' onClick={() => navigate(-1)}><ArrowLeftCircle size={20}/></button>
    );
};

export default BackwardButton;