class ApiMainPage {
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
// API запросы с информацией на 
// главной странице сайта
/////////////////////////////////

  getMainPageInfo () {
    return fetch(
      `/api/main-page`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

}

export default new ApiMainPage(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })
