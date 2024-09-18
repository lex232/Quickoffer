class ApiBrands {
    constructor (url, headers, contentType) {
      this._url = url
      this._headers = headers
      this._contentType = contentType
    }
  
    /**
    * Проверяет ответ запроса.
    */
    checkResponse (res) {
      return new Promise((resolve, reject) => {
        if (res.status === 204) {
          return resolve(res)
        }
        const func = res.status < 400 ? resolve : reject
        res.json().then(data => func(data))
      })
    }

  /**
  * Получаем список брендов (все параметры).
  */
  getBrands () {
    return fetch(
      `/api/brands/`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

  /**
  * Получаем список брендов в формате имени и ID.
  */
  getBrandsShortInfo () {
    return fetch(
      `/api/brands/onlynamesid/`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

  /**
  * Получаем список брендов в формате имени и ID по ID категории.
  */
  getBrandsOnCategory ({
    category_id,
  }) {
    return fetch(
      `/api/brands/${category_id}/brand_on_category/`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

}

export default new ApiBrands(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })
