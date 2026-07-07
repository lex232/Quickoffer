import React, { useEffect, useState, useRef } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import items_api from '../../../api/items_api';
import group_api from '../../../api/group_api';
import brands_api from '../../../api/brands_api';
import getBase64 from '../../../utils/getBase64';
import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'
import './styles.css'

const ItemForm = ({
  id,
  title,
  description,
  group,
  brand,
  price_retail,
  quantity_type,
  item_type,
  image
}) => {
  const navigate = useNavigate()
  const [ titleArea, setTitle ] = useState(title)
  const [ descriptionArea, setDescription ] = useState(description)
  const [ groupArea, setGroup ] = useState(group)
  const [ brandArea, setBrand ] = useState(brand)
  const [ priceRetailArea, setPriceRetail ] = useState(price_retail)
  const [ quantityTypeArea, setQuantityType ] = useState(quantity_type)
  const [ itemTypeArea, setItemType ] = useState(item_type)

  const [ listGroups, setListGroups] = useState(null)
  const [ listBrands, setListBrands] = useState(null)

  const [ selectedImage, setSelectedImage ] = useState(undefined)
  const [ preview, setPreview ] = useState(image)
  const [ errors, setErrors ] = useState({})
  // Ссылка на имя файла в форме
  const refImg = useRef();

  useEffect(() => {
    getGroups();
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


  const getGroups = () => {
    // Получить список категорий товаров
    group_api.getItemsGroupOnCreateUserItem()
    .then(res => {
      setListGroups(res);
    })
    .catch((e) => console.log(e))
    // Получить список брендов
    brands_api.getBrandsShortInfo()
    .then(res => {
      setListBrands(res);
    })
    .catch((e) => console.log(e))
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

  async function handlePostCLiсk(e) {
    e.preventDefault();
    setErrors({})

    if (!titleArea || !titleArea.trim()) {
      setErrors({ title: 'Наименование обязательно' })
      return
    }
    if (!priceRetailArea || priceRetailArea <= 0) {
      setErrors({ price_retail: 'Цена должна быть больше 0' })
      return
    }

    if (image === null) {
      image = undefined
    }

    const data = {
      title: titleArea,
      description: descriptionArea,
      group: groupArea,
      brand: brandArea,
      price_retail: priceRetailArea,
      quantity_type: quantityTypeArea,
      item_type: itemTypeArea,
      image: selectedImage,
    }
    try {
      if (id === undefined) {
        await items_api.createItem(data)
      } else {
        data.item_id = id
        await items_api.updateItem(data)
      }
      navigate("/profile/items/list")
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
                <label>Наименование товара или услуги *</label>
                <input type="text" defaultValue={title} className={`form-control border-input${errors.title ? ' is-invalid' : ''}`} id="Title" placeholder="Наименование товара или услуги *" onChange={(e) => setTitle(e.target.value)} />
                {errors.title && <div className="invalid-feedback d-block">{Array.isArray(errors.title) ? errors.title[0] : errors.title}</div>}
            </div>
        </div>
        <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Товар или услуга *</label>
                <select className={`form-select border-input${errors.item_type ? ' is-invalid' : ''}`} value={itemTypeArea} aria-label="Товар или услуга *" id="ItemType" onChange={(e) => setItemType(e.target.value)}>
                  <option value='product'>Товар</option>
                  <option value='service'>Услуга</option>
                </select>
                {errors.item_type && <div className="invalid-feedback d-block">{Array.isArray(errors.item_type) ? errors.item_type[0] : errors.item_type}</div>}
            </div>
          </div>
        </div>

        <div className="row mx-0 justify-content-left">
          <div className="col-md-12 ps-0 pe-2">
            <div className="form-group">
                <label>Описание:</label>
                <textarea rows='4' defaultValue={description} className={`form-control border-input${errors.description ? ' is-invalid' : ''}`} id="Title" placeholder="Наименование товара или услуги *" onChange={(e) => setDescription(e.target.value)} />
                {errors.description && <div className="invalid-feedback d-block">{Array.isArray(errors.description) ? errors.description[0] : errors.description}</div>}
            </div>
          </div>
        </div>

        <div className="row mx-0 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <label>Группа:</label>
            {listGroups && <div className="form">
              <select name='selectSF' className={`form-select border-input${errors.group ? ' is-invalid' : ''}`} aria-label='Категория ПО' id="floatingSelectFS" onChange={(e) => setGroup(Number(e.target.value))}>
                <option value=''>---</option>
                {listGroups.map((catList) => {
                  if (groupArea) {
                    if (groupArea.id === catList.id) {setGroup(Number(catList.id))}
                  }
                  return (
                  groupArea === catList.id ? <option selected value={catList.id}>{catList.title}</option> : <option value={catList.id}>{catList.title}</option>
                )
                })}
              </select>
              {errors.group && <div className="invalid-feedback d-block">{Array.isArray(errors.group) ? errors.group[0] : errors.group}</div>}
            </div>}
          </div>
          <div className="col-md-6 ps-0 pe-2">
            <label>Бренд</label>
              {listBrands && <div className="form">
              <select name='selectSF' className={`form-select border-input${errors.brand ? ' is-invalid' : ''}`} aria-label='Категория ПО' id="floatingSelectFS" onChange={(e) => setBrand(Number(e.target.value))}>
                <option value=''>---</option>
                {listBrands.map((brandList) => {
                  if (brandArea === brandList.title) {setBrand(Number(brandList.id))}
                  return (
                    brandArea === brandList.id ? <option selected value={brandList.id}>{brandList.title}</option> : <option value={brandList.id}>{brandList.title}</option>
                  )
                })}
              </select>
              {errors.brand && <div className="invalid-feedback d-block">{Array.isArray(errors.brand) ? errors.brand[0] : errors.brand}</div>}
            </div>}
          </div>
        </div>

        <div className="row mx-0 justify-content-left">
          <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Цена розничная (Руб.) *</label>
                <input type="text" defaultValue={price_retail} className={`form-control border-input${errors.price_retail ? ' is-invalid' : ''}`} id="PriceRetail" placeholder="Розничная цена *" onChange={(e) => setPriceRetail(e.target.value)} />
                {errors.price_retail && <div className="invalid-feedback d-block">{Array.isArray(errors.price_retail) ? errors.price_retail[0] : errors.price_retail}</div>}
            </div>
        </div>
        <div className="col-md-6 ps-0 pe-2">
            <div className="form-group">
                <label>Единицы измерения</label>
                <select className={`form-select border-input${errors.quantity_type ? ' is-invalid' : ''}`} value={quantityTypeArea} aria-label="Товар или услуга *" id="QuantityType" onChange={(e) => setQuantityType(e.target.value)}>
                  <option selected value='pc'>шт.</option>
                  <option value='meters'>м.</option>
                  <option value='kms'>км.</option>
                </select>
                {errors.quantity_type && <div className="invalid-feedback d-block">{Array.isArray(errors.quantity_type) ? errors.quantity_type[0] : errors.quantity_type}</div>}
            </div>
          </div>
        </div>
          <div className='d-flex pt-3'>
            {preview && <div className='d-flex position-relative'>
                <img className="col-1.5 mt-1 me-4" width="100" src={preview} alt=""/>
                <button className='position-absolute translate-middle top-0 start-0' onClick={(e) => deletePic(e)}><DeleteIco fill="red" width='32' height='32'/></button>
            </div>}
            <div className="form col">
              <label for="floatingPassword">Изображение товара</label>
              <input type="file" ref={refImg} className="form-control my-3" id="floatingImage" placeholder="Изображение" onChange={(e) => handleChangeImage(e)}/>
            </div>
          </div>
          <button onClick={(e) => handlePostCLiсk(e)} className="w-50 btn btn-medium btn-primary mt-3">Опубликовать</button>
      </form>
      </div>
  );
};

export default ItemForm;