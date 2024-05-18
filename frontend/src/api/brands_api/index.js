class ApiBrands {
    constructor (url, headers, contentType) {
      this._url = url
      this._headers = headers
      this._contentType = contentType
    }
  
    // Проверка ответа
    checkResponse (res) {
      return new Promise((resolve, reject) => {
        if (res.status === 204) {
          return resolve(res)
        }
        const func = res.status < 400 ? resolve : reject
        res.json().then(data => func(data))
      })
    }

/////////////////////////////////
// API запросы с разделами и
// категориями разделов
/////////////////////////////////

  getBrands () {
    return fetch(
      `/api/brands/`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

  getBrandsShortInfo () {
    return fetch(
      `/api/brands/onlynamesid/`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

}

export default new ApiBrands(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })