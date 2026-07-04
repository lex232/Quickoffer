import React from 'react';

import MainProfileInfo from './MainProfileInfo';

const ProfileDashboard = ({ loginstate, onSignOut, user }) => {
  let username = user.username

  return (
    <main className="profile-body">
      <h3 className="profile-greeting">Привет, {username}</h3>
      <MainProfileInfo />
    </main>
  );
};

export default ProfileDashboard;
