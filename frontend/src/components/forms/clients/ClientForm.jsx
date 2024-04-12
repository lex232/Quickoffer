import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import clients_api from '../../../api/clients_api';
import getBase64 from '../../../utils/getBase64';

import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'

const ClientForm = ({
    id,
    title,
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
  const [ titleArea, setTitle ] = useState(title)
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

  const handleChangeTitle = (e) => {
    // Устанавливаем имя записи на событии onChange
    setTitle(e.target.value);
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
      title: titleArea,
      ogrn: ogrnArea,
      inn: innArea,
      kpp: kppArea,
      address_reg: addressRegArea,
      address_post: addressPostArea,
      bill_num: billNumArea,
      bill_corr_num: billCorrNumArea,
      bank_name: bankNameArea,
      image: selectedImage,
    }

    if (id === undefined) {
      // Если из состояния не пришел id, отправляем POST запрос
      clients_api.createClient(data)
      return navigate("/profile/")
    } else {
      // Иначе PATCH
      data.news_id = id
      clients_api.updateClient(data)
      return navigate("/profile/")
    }
}

  return (
      <form>
          <div className="form">
            <input type="header" defaultValue={title} className="form-control my-3" id="Name" placeholder="Наименование ООО или ИП *" onChange={(e) => handleChangeTitle(e)} /> 
          </div>
          <div className="form">
            <input type="header" defaultValue={ogrn} className="form-control my-3" id="Ogrn" placeholder="ОГРН" onChange={(e) => handleChangeOgrn(e)} />
          </div>
          <div className="form">
            <input type="header" defaultValue={inn} className="form-control my-3" id="Inn" placeholder="ИНН" onChange={(e) => handleChangeInn(e)} />
          </div>
          <div className="form">
            <input type="header" defaultValue={kpp} className="form-control my-3" id="Kpp" placeholder="КПП" onChange={(e) => handleChangeKpp(e)} />
          </div>
          <div className="form">
            <input type="header" defaultValue={address_reg} className="form-control my-3" id="AddressReg" placeholder="Адрес регистрации" onChange={(e) => handleChangeAddressReg(e)} />
          </div>
          <div className="form">
            <input type="header" defaultValue={address_post} className="form-control my-3" id="Address" placeholder="Адрес местанахождения" onChange={(e) => handleChangeAddressPost(e)} />
          </div>
          <div className="form">
            <input type="header" defaultValue={bill_num} className="form-control my-3" id="Bill" placeholder="Расчетный счет" onChange={(e) => handleChangeBillNum(e)} />
          </div>
          <div className="form">
            <input type="header" defaultValue={bill_corr_num} className="form-control my-3" id="CorrBill" placeholder="Корреспондентский счет" onChange={(e) => handleChangeBillCorrNum(e)} />
          </div>
          <div className="form">
            <input type="header" defaultValue={bank_name} className="form-control my-3" id="BankName" placeholder="Наименование банка" onChange={(e) => handleChangeBankName(e)} />
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
          <button onClick={(e) => handlePostCLiсk(e)} className="w-50 btn btn-medium btn-primary mt-3">Опубликовать</button>
      </form>
  );
};

export default ClientForm;