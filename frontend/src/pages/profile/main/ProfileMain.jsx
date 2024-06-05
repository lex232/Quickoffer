import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import MainProfileInfo from './MainProfileInfo';

const ProfileDashboard = () => {
  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">   
      <div class="container-fluid">
        <div class="page-title">
          <div class="row">
            <div class="col-sm-6 my-3 text-start">
              <h3>Главный экран</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-12 project-list">
        <div class="card-header">
          <div className="card-body">
            <MainProfileInfo />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileDashboard;