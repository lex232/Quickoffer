class activeUrl {
     /**
    * Создает экземпляр activeUrl.
    *
    * @constructor
    * @this  {activeUrl}
    * @param {url} Url для проверки
    * @param {style_active} Стиль при активной странице
    * @param {style_non_active} Стиль при не активной странице.
    */
  constructor(url, style_active, style_non_active) {
    this._url = url;
    this._style_active = style_active;
    this._style_non_active = style_non_active;
  }

  /**
  * Возвращает стиль на основе вхождения в URL.
  */
  check_active(subUrl) {
    if (String(this._url).includes(subUrl)) {
      return this._style_active
    }
    return this._style_non_active
  } 

  /**
  * Возвращает стиль на основе вхождения в URL.
  */
  check_absolute_url(absUrl) {
    if (this._url === absUrl) {
      return this._style_active
    }
    return this._style_non_active
  }
}

export default activeUrl