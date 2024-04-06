 // Класс подсветки (nav) кнопок меню

class activeUrl {
  constructor(url, style_active, style_non_active) {
    this._url = url;
    this._style_active = style_active;
    this._style_non_active = style_non_active;
  }

  check_active(subUrl) {
    // Проверка вхождения
    if (String(this._url).includes(subUrl)) {
      return this._style_active
    }
    return this._style_non_active
  } 

  check_absolute_url(absUrl) {
    // Проверка точного совпадения
    if (this._url === absUrl) {
      return this._style_active
    }
    return this._style_non_active
  }
}

export default activeUrl