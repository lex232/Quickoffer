import React from 'react';
import BackwardButton from '../buttons/backwardButton';

const TitleSections = ({ title }) => {

    return (
        <div className="row my-2 align-items-center">
            <div className="col-2 text-start py-0">
                <BackwardButton />
            </div>
            <div className="col-10 text-end pe-4">
                <h3>{title}</h3>
            </div>
      </div>
    );
};

export default TitleSections;