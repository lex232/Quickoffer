import React from 'react';

import MainProfileInfo from './MainProfileInfo';

const ProfileDashboard = ({ loginstate, onSignOut, user }) => {
  /**
  * Страница личного кабинета
  */

  //let username = user.username
  //{username && <span>{username}</span>}
  
  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">   
      <div className="container-fluid">
        <div className="page-title">
          <div className="row">
            <div className="col-sm-6 my-3 text-start ps-4">
              <h3>Главный экран </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12 project-list">
        <div className="card-header">
          <div className="card-body pt-0 px-2">
            <MainProfileInfo />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileDashboard;