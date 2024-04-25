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
  image
}) => {
  const navigate = useNavigate()

  const [ idProfile, setIdProfile ] = useState(id)
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


  const handleChangeCompanyName = (e) => {
    // Устанавливаем имя записи на событии onChange
    setCompanyName(e.target.value);
  }

  const handleChangeCompanyDocs = (e) => {
    // Устанавливаем имя записи на событии onChange
    setCompanyNameDocs(e.target.value);
  }

  const handleChangeOgrn = (e) => {
    // Устанавливаем текст записи на событии onChange
    setOgrn(e.target.value);
  }

  const handleChangeInn = (e) => {
    // Устанавливаем текст записи на событии onChange
    setInn(e.target.value);
  }

  const handleChangeKpp = (e) => {
    // Устанавливаем текст записи на событии onChange
    setKpp(e.target.value);
  }

  const handleChangeAddressReg = (e) => {
    // Устанавливаем текст записи на событии onChange
    setAddressReg(e.target.value);
  }

  const handleChangeAddressPost = (e) => {
    // Устанавливаем текст записи на событии onChange
    setAddressPost(e.target.value);
  }

  const handleChangeBillNum = (e) => {
    // Устанавливаем текст записи на событии onChange
    setBillNum(e.target.value);
  }

  const handleChangeBillCorrNum = (e) => {
    // Устанавливаем текст записи на событии onChange
    setBillCorrNum(e.target.value);
  }

  const handleChangeBankName = (e) => {
    // Устанавливаем текст записи на событии onChange
    setBankName(e.target.value);
  }

  const handleChangeCompanyType = (e) => {
    // Устанавливаем значение типа компании onChange
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
      id: idProfile,
      company_name: companyNameArea,
      company_name_for_docs,
      company_type,
      image,
      ogrn,
      inn,
      kpp,
      address_reg,
      address_post,
      bill_num,
      bill_corr_num,
      bank_name,
    }


    // Иначе PATCH
    user_api.updateProfile(data)
    return navigate("/profile/")
    
}

return (
<form className='my-3'>
      <div className="form d-flex">
        <span className='col-3'>Юридическое имя:</span>
        <div className='col-9'>
          <input type="header" defaultValue={company_name} className="form-control my-1" id="NameCompany" placeholder="Наименование ООО или ИП для документов *" onChange={(e) => handleChangeCompanyName(e)} /> 
        </div>
      </div>
      <div className="form d-flex">
        <div className='col-3'>Название компании:</div>
        <div className='col-9'>
          <input type="header" defaultValue={company_name_for_docs} className="form-control my-1" id="NameCompanyForDocs" placeholder="Название компании в коммерческом предложении" onChange={(e) => handleChangeCompanyDocs(e)} /> 
        </div>
      </div>
      <div className="form d-flex">
        <div className='col-3'>Форма собственности:</div>
        <div className='col-9'>
          <select className='form-select my-1' aria-label="Форма собственности *" id="CompanyType" onChange={(e) => handleChangeCompanyType(e)}>
            <option selected value='ip'>ИП</option>
            <option value='ooo'>ООО</option>
          </select>
        </div>
      </div>  
      <div className="form d-flex">
        <div className='col-3'>ОГРН:</div>
        <div className='col-9'>
          <input type="header" defaultValue={ogrn} className="form-control my-1" id="Ogrn" placeholder="ОГРН" onChange={(e) => handleChangeOgrn(e)} />
        </div>
      </div>
      <div className="form d-flex">
        <div className='col-3'>ИНН:</div>
        <div className='col-9'>
          <input type="header" defaultValue={inn} className="form-control my-1" id="Inn" placeholder="ИНН" onChange={(e) => handleChangeInn(e)} />
        </div>
      </div>
      <div className="form d-flex">
        <div className='col-3'>КПП:</div>
        <div className='col-9'>
          <input type="header" defaultValue={kpp} className="form-control my-1" id="Kpp" placeholder="КПП" onChange={(e) => handleChangeKpp(e)} />
        </div>
      </div>
      <div className="form d-flex">
        <div className='col-3'>Адрес регистрации:</div>
        <div className='col-9'>
          <input type="header" defaultValue={address_reg} className="form-control my-1" id="AddressReg" placeholder="Адрес регистрации" onChange={(e) => handleChangeAddressReg(e)} />
        </div>
      </div>
      <div className="form d-flex">
        <div className='col-3'>Адрес почтовый:</div>
        <div className='col-9'>
          <input type="header" defaultValue={address_post} className="form-control my-1" id="Address" placeholder="Адрес местанахождения" onChange={(e) => handleChangeAddressPost(e)} />
        </div>
      </div>
      <div className="form d-flex">
        <div className='col-3'>Счет расчетный:</div>
        <div className='col-9'>
          <input type="header" defaultValue={bill_num} className="form-control my-1" id="Bill" placeholder="Расчетный счет" onChange={(e) => handleChangeBillNum(e)} />
        </div>
      </div>
      <div className="form d-flex">
        <div className='col-3'>Счет корреспондентский:</div>
        <div className='col-9'>
          <input type="header" defaultValue={bill_corr_num} className="form-control my-1" id="CorrBill" placeholder="Корреспондентский счет" onChange={(e) => handleChangeBillCorrNum(e)} />
        </div>
      </div>
      <div className="form d-flex">
        <div className='col-3'>Название банка:</div>
        <div className='col-9'>
          <input type="header" defaultValue={bank_name} className="form-control my-1" id="BankName" placeholder="Наименование банка" onChange={(e) => handleChangeBankName(e)} />
        </div>
      </div>
      <div className='d-flex'>
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
  
);
};

export default ProfileForm;