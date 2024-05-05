import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import items_api from '../../../api/items_api';
import group_api from '../../../api/group_api';
import getBase64 from '../../../utils/getBase64';

import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'

const ItemForm = ({
  id,
  title,
  description,
  group,
  price_retail,
  quantity_type,
  item_type,
  image
}) => {
  const navigate = useNavigate()
  const [ titleArea, setTitle ] = useState(title)
  const [ descriptionArea, setDescription ] = useState(description)
  const [ groupArea, setGroup ] = useState(group)
  const [ priceRetailArea, setPriceRetail ] = useState(price_retail)
  const [ quantityTypeArea, setQuantityType ] = useState(quantity_type)
  const [ itemTypeArea, setItemType ] = useState(item_type)

  const [ listGroups, setListGroups] = useState(null)

  const [ selectedImage, setSelectedImage ] = useState(undefined)
  const [ preview, setPreview ] = useState(image)
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
    group_api.getItemsGroup()
    .then(res => {
      setListGroups(res);
    })
    .catch((e) => console.log(e))
  }

  const handleChangeTitle = (e) => {
    // Устанавливаем имя записи на событии onChange
    setTitle(e.target.value);
  }

  const handleChangeDescription = (e) => {
    // Устанавливаем текст записи на событии onChange
    setDescription(e.target.value);
  }

  const handleChangeGroup = (e) => {
    // Устанавливаем номер категории на событии onChange
    e.preventDefault();
    setGroup(Number(e.target.value));
  }

  const handleChangePriceRetail = (e) => {
    // Устанавливаем цену розничную на событии onChange
    setPriceRetail(e.target.value);
  }

  const handleChangeQuantityType = (e) => {
    // Устанавливаем кол-во товара на событии onChange
    setQuantityType(e.target.value);
  }

  const handleChangeItemType = (e) => {
    // Устанавливаем тип товара на событии onChange
    setItemType(e.target.value);
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
      description: descriptionArea,
      group: groupArea,
      price_retail: priceRetailArea,
      quantity_type: quantityTypeArea,
      item_type: itemTypeArea,
      image: selectedImage,
    }

    if (id === undefined) {
      // Если из состояния не пришел id, отправляем POST запрос
      items_api.createItem(data)
      return navigate("/profile/")
    } else {
      // Иначе PATCH
      data.item_id = id
      items_api.updateItem(data)
      return navigate("/profile/")
    }
}

  return (
      <form>
          <div className="form">
            <input type="header" defaultValue={title} className="form-control my-3" id="Title" placeholder="Наименование товара или услуги *" onChange={(e) => handleChangeTitle(e)} /> 
          </div>
          <div className="form">
            <input type="header" defaultValue={description} className="form-control my-3" id="Description" placeholder="Описание или характеристики" onChange={(e) => handleChangeDescription(e)} />
          </div>
          {listGroups && <div className="form">
             <select name='selectSF' className='form-select my-3' aria-label='Категория ПО' id="floatingSelectFS" onChange={(e) => handleChangeGroup(e)}>
              {listGroups.map((catList) => {
                return (
                <option value={catList.id}>{catList.title}</option>
              )
              })}
            </select>
          </div>}
          <div className="form">
            <input type="header" defaultValue={price_retail} className="form-control my-3" id="PriceRetail" placeholder="Розничная цена *" onChange={(e) => handleChangePriceRetail(e)} />
          </div>
          <select className='form-select my-3' aria-label="Количественный тип" id="QuantityType" onChange={(e) => handleChangeQuantityType(e)}>
            <option selected value='pc'>шт.</option>
            <option value='meters'>м.</option>
          </select>
          <select className='form-select my-3' aria-label="Товар или услуга *" id="ItemType" onChange={(e) => handleChangeItemType(e)}>
            <option selected value='product'>Товар</option>
            <option value='service'>Услуга</option>
          </select>
          <div className='d-flex'>
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
  );
};

export default ItemForm;