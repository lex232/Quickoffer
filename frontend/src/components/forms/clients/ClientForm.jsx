// Форма обработки полей создание клиента
import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import clients_api from '../../../api/clients_api';
import getBase64 from '../../../utils/getBase64';

import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'


const ClientForm = ({
    id,
    title,
    company_type,
    ogrn,
    inn,
    kpp,
    address_reg,
    address_post,
    bill_num,
    bill_corr_num,
    bank_name,
    phone_company,
    image
}) => {
  const navigate = useNavigate()
  const [ titleArea, setTitle ] = useState(title)
  const [ ogrnArea, setOgrn ] = useState(ogrn)
  const [ innArea, setInn ] = useState(inn)
  const [ kppArea, setKpp ] = useState(kpp)
  const [ addressRegArea, setAddressReg ] = useState(address_reg)
  const [ addressPostArea, setAddressPost ] = useState(address_post)
  const [ billNumArea, setBillNum ] = useState(bill_num)
  const [ billCorrNumArea, setBillCorrNum ] = useState(bill_corr_num)
  const [ bankNameArea, setBankName ] = useState(bank_name)
  const [ companyTypeArea, setCompanyType ] = useState(company_type)
  const [ phoneCompanyArea, setPhoneCompany ] = useState(phone_company)
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

  const handleChangeCompanyType = (e) => {
    // Устанавливаем значение типа компании onChange
    e.preventDefault();
    setCompanyType(e.target.value);
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
      title: titleArea,
      company_type: companyTypeArea,
      ogrn: ogrnArea,
      inn: innArea,
      kpp: kppArea,
      address_reg: addressRegArea,
      address_post: addressPostArea,
      bill_num: billNumArea,
      bill_corr_num: billCorrNumArea,
      bank_name: bankNameArea,
      phone_company: phoneCompanyArea,
      image: selectedImage,
    }
    if (id === undefined) {
      // Если из состояния не пришел id, отправляем POST запрос
      clients_api.createClient(data)
      return navigate("/profile/clients/list")
    } else {
      // Иначе PATCH
      data.id = id
      clients_api.updateClient(data)
      return navigate("/profile/clients/list")
    }
}

  return (
      <form>
        <div className="form pt-1">
          <div className="form d-flex">
            <span className='col-3'>Наименование:</span>
            <div className='col-9'>
              <input type="text" defaultValue={title} className="form-control my-2" id="Name" placeholder="Наименование ООО или ИП *" onChange={(e) => setTitle(e.target.value)} /> 
            </div>
          </div>
          <div className="form d-flex">
            <span className='col-3'>Тип компании:</span>
            <div className='col-9'>
              <select className='form-select my-2' value={companyTypeArea} aria-label="Товар или услуга *" id="CompanyType" onChange={(e) => handleChangeCompanyType(e)}>
                <option value='ip'>ИП</option>
                <option value='ooo'>ООО</option>
                <option value='fiz'>Физическое лицо</option>
              </select>
              </div>
          </div>
          <div className="form d-flex">
            <span className='col-3'>ОГРН:</span>
            <div className='col-9'>
              <input type="text" defaultValue={ogrn} className="form-control my-2" id="Ogrn" placeholder="ОГРН" onChange={(e) => setOgrn(e.target.value)} />
            </div>
          </div>          
          <div className="form d-flex">
            <span className='col-3'>ИНН:</span>
            <div className='col-9'>
            <input type="text" defaultValue={inn} className="form-control my-2" id="Inn" placeholder="ИНН" onChange={(e) => setInn(e.target.value)} />
            </div>
          </div>          
          <div className="form d-flex">
            <span className='col-3'>КПП:</span>
            <div className='col-9'>
            <input type="text" defaultValue={kpp} className="form-control my-2" id="Kpp" placeholder="КПП" onChange={(e) => setKpp(e.target.value)} />
            </div>
          </div>
          <div className="form d-flex">
            <span className='col-3'>Адрес регистрации:</span>
            <div className='col-9'>          
            <input type="text" defaultValue={address_reg} className="form-control my-2" id="AddressReg" placeholder="Адрес регистрации" onChange={(e) => setAddressReg(e.target.value)} />
            </div>
          </div>          
          <div className="form d-flex">
            <span className='col-3'>Адрес местонахождения:</span>
            <div className='col-9'>
            <input type="text" defaultValue={address_post} className="form-control my-2" id="Address" placeholder="Адрес местонахождения" onChange={(e) => setAddressPost(e.target.value)} />
            </div>
          </div>          
          <div className="form d-flex">
            <span className='col-3'>Расчетный счет:</span>
            <div className='col-9'>
            <input type="text" defaultValue={bill_num} className="form-control my-2" id="Bill" placeholder="Расчетный счет" onChange={(e) => setBillNum(e.target.value)} />
            </div>
          </div>          
          <div className="form d-flex">
            <span className='col-3'>Корреспондентский счет:</span>
            <div className='col-9'>
            <input type="text" defaultValue={bill_corr_num} className="form-control my-2" id="CorrBill" placeholder="Корреспондентский счет" onChange={(e) => setBillCorrNum(e.target.value)} />
            </div>
          </div>          
          <div className="form d-flex">
            <span className='col-3'>Наименование банка:</span>
            <div className='col-9'>
            <input type="text" defaultValue={bank_name} className="form-control my-2" id="BankName" placeholder="Наименование банка" onChange={(e) => setBankName(e.target.value)} />
            </div>
          </div>          
          <div className="form d-flex">
            <span className='col-3'>Телефон организации:</span>
            <div className='col-9'>
            <input type="text" defaultValue={phone_company} className="form-control my-2" id="PhoneCompany" placeholder="Телефон организации" onChange={(e) => setPhoneCompany(e.target.value)} />
            </div>
          </div>          
          </div>
          <div className='d-flex'>
            {preview && <div className='d-flex position-relative'>
                <img className="col-1.5 mt-1 me-4" width="100" src={preview} alt=""/>
                <button className='position-absolute translate-middle top-0 start-0' onClick={(e) => deletePic(e)}><DeleteIco fill="red" width='32' height='32'/></button>
            </div>}
            <div className="form col">
              <label for="floatingPassword">Лого компании</label>
              <input type="file" ref={refImg} className="form-control my-2" id="floatingImage" placeholder="Изображение" onChange={(e) => handleChangeImage(e)}/>
            </div>
          </div>
          <button onClick={(e) => handlePostCLiсk(e)} className="w-50 btn btn-medium btn-primary mt-3">Опубликовать</button>
      </form>
  );
};

export default ClientForm;