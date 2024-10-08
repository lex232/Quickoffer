import React, { useEffect, useState } from 'react';

import ProfileForm from '../../../components/forms/profile/ProfileForm';
import user_api from '../../../api/user_api';
import './styles.css'


const ProfileEdit = () => {
  /**
  * Страница редактирования пользователя
  */

  // const [currentUserData, setCurrentUserData] = useState([]);
  const [currentProfileData, setCurrentProfileData] = useState([]);
  const [isLoadding, setIsLoadding] = useState(true);

  useEffect(() => {
    // Получить все полные данные текущего пользователя
    getCurrentUserAll();
  }, [])
  ;

  const getCurrentUserAll = () => {
    user_api.getUserDataAll()
    .then(res => {
      // setCurrentUserData(res);
      setCurrentProfileData(res.profile);
    })
    .catch((e) => console.log(e))
    .finally(()=> setIsLoadding(false))
}

  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">
      
        <div className="container-fluid">
          <div className="page-title">
            <div className="row">
              <div className="col-sm-6 my-3 text-start ps-4">
                <h3>Редактировать свои реквизиты</h3>
              </div>
            </div>
          </div>
        </div>      

        <div className="col-md-12 project-list">
        <div className="card-header">
          <div className="card-body  pt-2">
           
            <div className="d-flex">
              {isLoadding && <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>}
            </div>

          <div className="col-lg-8 col-md-9 col-sm-12 text-start mx-0">
            <ProfileForm
              id={currentProfileData.id}
              company_name={currentProfileData.company_name}
              company_name_for_docs={currentProfileData.company_name_for_docs}
              company_type={currentProfileData.company_type}
              ogrn={currentProfileData.ogrn}
              inn={currentProfileData.inn}
              kpp={currentProfileData.kpp}
              address_reg={currentProfileData.address_reg}
              address_post={currentProfileData.address_post}
              bill_num={currentProfileData.bill_num}
              bill_corr_num={currentProfileData.bill_corr_num}
              bank_name={currentProfileData.bank_name}
              image={currentProfileData.image}
              phone={currentProfileData.phone}
              bik={currentProfileData.bik}
              ruk={currentProfileData.ruk}
          /></div>
          </div>
      </div>
      </div>
    </main>
  );
};

export default ProfileEdit;
