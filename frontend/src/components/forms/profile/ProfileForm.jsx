import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import user_api from '../../../api/user_api';
import getBase64 from '../../../utils/getBase64';

import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'

const ProfileForm = ({
  id,
  company_name,
  company_name_for_docs,
  company_type,
  ogrn,
  inn,
  kpp,
  address_reg,
  address_post,
  bill_num,
  bill_corr_num,
  bank_name,
  image,
  phone,
  bik,
  ruk
}) => {
  const navigate = useNavigate()

  // const [ idProfile, setIdProfile ] = useState(id)
  const [ companyNameArea, setCompanyName ] = useState(company_name)
  const [ companyNameDocsArea, setCompanyNameDocs ] = useState(company_name_for_docs)
  const [ companyTypeArea, setCompanyType ] = useState(company_type)
  const [ ogrnArea, setOgrn ] = useState(ogrn)
  const [ innArea, setInn ] = useState(inn)
  const [ kppArea, setKpp ] = useState(kpp)
  const [ addressRegArea, setAddressReg ] = useState(address_reg)
  const [ addressPostArea, setAddressPost ] = useState(address_post)
  const [ billNumArea, setBillNum ] = useState(bill_num)
  const [ billCorrNumArea, setBillCorrNum ] = useState(bill_corr_num)
  const [ bankNameArea, setBankName ] = useState(bank_name)
  const [ phoneArea, setPhone ] = useState(phone)
  const [ bikArea, setBik ] = useState(bik)
  const [ rukArea, setRuk ] = useState(ruk)
  const [ selectedImage, setSelectedImage ] = useState(undefined)
  const [ preview, setPreview ] = useState(image)
  // Ссылка на имя файла в форме
  const refImg = useRef();
  
  useEffect(() => {
    // Если картинка не выбрана пользователем
    if (!selectedImage) {
      setPreview(undefined)
      // Но есть картинка, переданная в состояние (из бд), то загружаем ее в превью
      if (preview) {
        setPreview(preview)
      }
      return
    }
    setPreview(selectedImage)
  }, [selectedImage])

  useEffect(() => {
    if (image) {
      setPreview(image)
      image = undefined
    }    
  }, [image])

  useEffect(() => {
    if (company_type) {
      setCompanyType(company_type)
    }    
  }, [company_type])

  const handleChangeCompanyName = (e) => {
    setCompanyName(e.target.value);
  }

  const handleChangeCompanyDocs = (e) => {
    setCompanyNameDocs(e.target.value);
  }

  const handleChangeOgrn = (e) => {
    setOgrn(e.target.value);
  }

  const handleChangeInn = (e) => {
    setInn(e.target.value);
  }

  const handleChangeKpp = (e) => {
    setKpp(e.target.value);
  }

  const handleChangeAddressReg = (e) => {
    setAddressReg(e.target.value);
  }

  const handleChangeAddressPost = (e) => {
    setAddressPost(e.target.value);
  }

  const handleChangeBillNum = (e) => {
    setBillNum(e.target.value);
  }

  const handleChangeBillCorrNum = (e) => {
    setBillCorrNum(e.target.value);
  }

  const handleChangeBankName = (e) => {
    setBankName(e.target.value);
  }

  const handleChangePhone = (e) => {
    setPhone(e.target.value);
  }

  const handleChangeBik = (e) => {
    setBik(e.target.value);
  }

  const handleChangeRuk = (e) => {
    setRuk(e.target.value);
  }

  const handleChangeCompanyType = (e) => {
    setCompanyType(e.target.value);
  }

  const handleChangeImage = (e) => {
    // Устанавливаем картинку записи на событии onChange
    // Если валидного файла нет, устанавливаем картинку в undefined
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedImage(undefined)
      return
    }
    // Переводим ее в base64
    const tempFile = e.target.files[0]
    getBase64(tempFile, setSelectedImage)
  }

  const deletePic = (e) => {
    // Кнопка удалить картинку
    e.preventDefault();
    image = null
    refImg.current.value = '';
    setPreview(undefined)
    // тут доработать удаление
    setSelectedImage(undefined)
  }

  function handlePostCLiсk(e) {
    // Обработать клик публикации
    e.preventDefault();
    // null не подходит для api, защита от отправки null
    if (image === null) {
      image = undefined
    }

    const data = {
      id,
      company_name: companyNameArea,
      company_name_for_docs: companyNameDocsArea,
      company_type: companyTypeArea,
      image: selectedImage,
      ogrn: ogrnArea,
      inn: innArea,
      kpp: kppArea,
      address_reg: addressRegArea,
      address_post: addressPostArea,
      bill_num: billNumArea,
      bill_corr_num: billCorrNumArea,
      bank_name: bankNameArea,
      phone: phoneArea,
      bik: bikArea,
      ruk: rukArea
    }

    // PATCH всегда, потому-что профиль создается при создании пользователя
    user_api.updateProfile(data)
    return navigate("/profile/")
    
}

return (
  <div class="content">
      <form>
        <div class="row mx-0 my-1 justify-content-left">
          <div class="col-md-6 ps-0 pe-2">
            <div class="form-group">
                <label>Юридическое имя:</label>
                <input type="header" defaultValue={company_name} className="form-control border-input" id="NameCompany" placeholder="Наименование ООО или ИП для документов *" onChange={(e) => handleChangeCompanyName(e)} /> 
            </div>
          </div>
          <div class="col-md-6 ps-0 pe-2">
              <div class="form-group">
                  <label>Название компании:</label>
                  <input type="header" defaultValue={company_name_for_docs} className="form-control border-input" id="NameCompanyForDocs" placeholder="Название компании в коммерческом предложении" onChange={(e) => handleChangeCompanyDocs(e)} /> 
              </div>
            </div>
        </div>

        <div class="row mx-0 my-1 justify-content-left">
          <div class="col-md-6 ps-0 pe-2">
            <div class="form-group">
                <label>Форма собственности:</label>
                <select className='form-select border-input' value={companyTypeArea} aria-label="Форма собственности *" id="CompanyType" onChange={(e) => handleChangeCompanyType(e)}>
                  <option value='ip'>ИП</option>
                  <option value='ooo'>ООО</option>
                </select>
          </div>
          </div>
          <div class="col-md-6 ps-0 pe-2">
              <div class="form-group">
                  <label>ОГРН:</label>
                  <input type="header" defaultValue={ogrn} className="form-control border-input" id="Ogrn" placeholder="ОГРН" onChange={(e) => handleChangeOgrn(e)} />
              </div>
            </div>
        </div>

        <div class="row mx-0 my-1 justify-content-left">
          <div class="col-md-6 ps-0 pe-2">
            <div class="form-group">
                <label>ИНН:</label>
                <input type="header" defaultValue={inn} className="form-control border-input" id="Inn" placeholder="ИНН" onChange={(e) => handleChangeInn(e)} />
          </div>
          </div>
          <div class="col-md-6 ps-0 pe-2">
              <div class="form-group">
                  <label>КПП:</label>
                  <input type="header" defaultValue={kpp} className="form-control border-input" id="Kpp" placeholder="КПП" onChange={(e) => handleChangeKpp(e)} />
              </div>
            </div>
        </div>

        <div class="row mx-0 my-1 justify-content-left">
          <div class="col-md-6 ps-0 pe-2">
            <div class="form-group">
              <label>Адрес регистрации:</label>
              <input type="header" defaultValue={address_reg} className="form-control border-input" id="AddressReg" placeholder="Адрес регистрации" onChange={(e) => handleChangeAddressReg(e)} />
          </div>
          </div>
          <div class="col-md-6 ps-0 pe-2">
            <div class="form-group">
              <label>Адрес почтовый:</label>
              <input type="header" defaultValue={address_post} className="form-control border-input" id="Address" placeholder="Адрес местанахождения" onChange={(e) => handleChangeAddressPost(e)} />
            </div>
          </div>
        </div>

        <div class="row mx-0 my-1 justify-content-left">
          <div class="col-md-6 ps-0 pe-2">
            <div class="form-group">
              <label>Счет расчетный:</label>
              <input type="header" defaultValue={bill_num} className="form-control border-input" id="Bill" placeholder="Расчетный счет" onChange={(e) => handleChangeBillNum(e)} />
          </div>
          </div>
          <div class="col-md-6 ps-0 pe-2">
            <div class="form-group">
              <label>Счет корреспондентский:</label>
              <input type="header" defaultValue={bill_corr_num} className="form-control border-input" id="CorrBill" placeholder="Корреспондентский счет" onChange={(e) => handleChangeBillCorrNum(e)} />
            </div>
          </div>
        </div>

        <div class="row mx-0 my-1 justify-content-left">
          <div class="col-md-6 ps-0 pe-2">
            <div class="form-group">
              <label>БИК:</label>
              <input type="header" defaultValue={bik} className="form-control border-input" id="CorrBill" placeholder="БИК" onChange={(e) => handleChangeBik(e)} />
          </div>
          </div>
          <div class="col-md-6 ps-0 pe-2">
            <div class="form-group">
              <label>Название банка:</label>
              <input type="header" defaultValue={bank_name} className="form-control border-input" id="BankName" placeholder="Наименование банка" onChange={(e) => handleChangeBankName(e)} />
            </div>
          </div>
        </div>

        <div class="row mx-0 my-1 justify-content-left">
          <div class="col-md-6 ps-0 pe-2">
            <div class="form-group">
              <label>Телефон:</label>
              <input type="header" defaultValue={phone} className="form-control border-input" id="CorrBill" placeholder="Телефон" onChange={(e) => handleChangePhone(e)} />
          </div>
          </div>
          <div class="col-md-6 ps-0 pe-2">
            <div class="form-group">
              <label>Руководитель (для подписи):</label>
              <input type="header" defaultValue={ruk} className="form-control border-input" id="CorrBill" placeholder="Руководитель" onChange={(e) => handleChangeRuk(e)} />
            </div>
          </div>
        </div>

        <div className='d-flex mt-4'>
          {preview && <div className='d-flex position-relative'>
              <img className="col-1.5 mt-1 me-4" width="100" src={preview} alt=""/>
              <button className='position-absolute translate-middle top-0 start-0' onClick={(e) => deletePic(e)}><DeleteIco fill="red" width='32' height='32'/></button>
          </div>}
          <div className="form col">
            <label for="floatingPassword">Лого компании</label>
            <input type="file" ref={refImg} className="form-control my-3" id="floatingImage" placeholder="Изображение" onChange={(e) => handleChangeImage(e)}/>
          </div>
        </div>
      <button onClick={(e) => handlePostCLiсk(e)} className="w-50 btn btn-medium btn-primary mt-3 mb-5">Сохранить</button>
  </form>
</div>  
);
};

export default ProfileForm;