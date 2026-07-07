// Форма обработки полей создание клиента
import React, { useEffect, useState, useRef } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
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
    bik,
    ruk,
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
  const [ bikArea, setBik ] = useState(company_type)
  const [ rukArea, setRuk ] = useState(ruk)
  const [ selectedImage, setSelectedImage ] = useState(undefined)
  const [ preview, setPreview ] = useState(image)
  const [ errors, setErrors ] = useState({})
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

  async function handlePostCLiсk(e) {
    e.preventDefault();
    setErrors({})

    if (!titleArea || !titleArea.trim()) {
      setErrors({ title: 'Наименование обязательно' })
      return
    }

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
      bik: bikArea,
      ruk: rukArea,
      image: selectedImage,
    }
    try {
      if (id === undefined) {
        await clients_api.createClient(data)
      } else {
        data.id = id
        await clients_api.updateClient(data)
      }
      navigate("/profile/clients/list")
    } catch (err) {
      if (err && typeof err === 'object') {
        setErrors(err)
      } else {
        setErrors({ title: 'Ошибка при сохранении' })
      }
    }
}

  return (
      
    <div className="content">
      <form>
        <div className="row mx-0 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Наименование: *</label>
                <input type="text" defaultValue={title} className={`form-control border-input${errors.title ? ' is-invalid' : ''}`} id="Name" placeholder="Наименование ООО или ИП *" onChange={(e) => setTitle(e.target.value)} />
                {errors.title && <div className="invalid-feedback d-block">{Array.isArray(errors.title) ? errors.title[0] : errors.title}</div>}
            </div>
          </div>
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
              <label>Тип компании:</label>
              <select className={`form-select border-input${errors.company_type ? ' is-invalid' : ''}`} value={companyTypeArea} aria-label="Товар или услуга *" id="CompanyType" onChange={(e) => handleChangeCompanyType(e)}>
                <option value='ip'>ИП</option>
                <option value='ooo'>ООО</option>
                <option value='fiz'>Физическое лицо</option>
              </select>
              {errors.company_type && <div className="invalid-feedback d-block">{Array.isArray(errors.company_type) ? errors.company_type[0] : errors.company_type}</div>}
            </div>
          </div>
        </div>

        <div className="row mx-0 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>ОГРН:</label>
                <input type="text" defaultValue={ogrn} className={`form-control border-input${errors.ogrn ? ' is-invalid' : ''}`} id="Ogrn" placeholder="ОГРН" onChange={(e) => setOgrn(e.target.value)} />
                {errors.ogrn && <div className="invalid-feedback d-block">{Array.isArray(errors.ogrn) ? errors.ogrn[0] : errors.ogrn}</div>}
            </div>
          </div>
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>ИНН:</label>
                <input type="text" defaultValue={inn} className={`form-control border-input${errors.inn ? ' is-invalid' : ''}`} id="Inn" placeholder="ИНН" onChange={(e) => setInn(e.target.value)} />
                {errors.inn && <div className="invalid-feedback d-block">{Array.isArray(errors.inn) ? errors.inn[0] : errors.inn}</div>}
            </div>
          </div>
        </div>

        <div className="row mx-0 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>КПП:</label>
                <input type="text" defaultValue={kpp} className={`form-control border-input${errors.kpp ? ' is-invalid' : ''}`} id="Kpp" placeholder="КПП" onChange={(e) => setKpp(e.target.value)} />
                {errors.kpp && <div className="invalid-feedback d-block">{Array.isArray(errors.kpp) ? errors.kpp[0] : errors.kpp}</div>}
            </div>
          </div>
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Адрес юридический:</label>
                <input type="text" defaultValue={address_reg} className={`form-control border-input${errors.address_reg ? ' is-invalid' : ''}`} id="AddressReg" placeholder="Адрес юридический" onChange={(e) => setAddressReg(e.target.value)} />
                {errors.address_reg && <div className="invalid-feedback d-block">{Array.isArray(errors.address_reg) ? errors.address_reg[0] : errors.address_reg}</div>}
            </div>
          </div>
        </div>

        <div className="row mx-0 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Адрес местонахождения:</label>
                <input type="text" defaultValue={address_post} className={`form-control border-input${errors.address_post ? ' is-invalid' : ''}`} id="Address" placeholder="Адрес местонахождения" onChange={(e) => setAddressPost(e.target.value)} />
                {errors.address_post && <div className="invalid-feedback d-block">{Array.isArray(errors.address_post) ? errors.address_post[0] : errors.address_post}</div>}
            </div>
          </div>
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Расчетный счет:</label>
                <input type="text" defaultValue={bill_num} className={`form-control border-input${errors.bill_num ? ' is-invalid' : ''}`} id="Bill" placeholder="Расчетный счет" onChange={(e) => setBillNum(e.target.value)} />
                {errors.bill_num && <div className="invalid-feedback d-block">{Array.isArray(errors.bill_num) ? errors.bill_num[0] : errors.bill_num}</div>}
            </div>
          </div>
        </div>

        <div className="row mx-0 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Корреспондентский счет:</label>
                <input type="text" defaultValue={bill_corr_num} className={`form-control border-input${errors.bill_corr_num ? ' is-invalid' : ''}`} id="CorrBill" placeholder="Корреспондентский счет" onChange={(e) => setBillCorrNum(e.target.value)} />
                {errors.bill_corr_num && <div className="invalid-feedback d-block">{Array.isArray(errors.bill_corr_num) ? errors.bill_corr_num[0] : errors.bill_corr_num}</div>}
            </div>
          </div>
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Наименование банка:</label>
                <input type="text" defaultValue={bank_name} className={`form-control border-input${errors.bank_name ? ' is-invalid' : ''}`} id="BankName" placeholder="Наименование банка" onChange={(e) => setBankName(e.target.value)} />
                {errors.bank_name && <div className="invalid-feedback d-block">{Array.isArray(errors.bank_name) ? errors.bank_name[0] : errors.bank_name}</div>}
            </div>
          </div>
        </div>

        <div className="row mx-0 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Телефон организации:</label>
                <input type="text" defaultValue={phone_company} className={`form-control border-input${errors.phone_company ? ' is-invalid' : ''}`} id="PhoneCompany" placeholder="Телефон организации" onChange={(e) => setPhoneCompany(e.target.value)} />
                {errors.phone_company && <div className="invalid-feedback d-block">{Array.isArray(errors.phone_company) ? errors.phone_company[0] : errors.phone_company}</div>}
            </div>
          </div>
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>БИК:</label>
                <input type="text" defaultValue={bik} className={`form-control border-input${errors.bik ? ' is-invalid' : ''}`} id="BankBik" placeholder="БИК банка" onChange={(e) => setBik(e.target.value)} />
                {errors.bik && <div className="invalid-feedback d-block">{Array.isArray(errors.bik) ? errors.bik[0] : errors.bik}</div>}
            </div>
          </div>
        </div>

        <div className="row mx-0 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Руководитель (для подписи):</label>
                <input type="text" defaultValue={ruk} className={`form-control border-input${errors.ruk ? ' is-invalid' : ''}`} id="RukCompany" placeholder="Руководитель" onChange={(e) => setRuk(e.target.value)} />
                {errors.ruk && <div className="invalid-feedback d-block">{Array.isArray(errors.ruk) ? errors.ruk[0] : errors.ruk}</div>}
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
    </div>
  );
};

export default ClientForm;