import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileDashboard = () => {
  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Главный экран</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">Редактировать</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileDashboard;