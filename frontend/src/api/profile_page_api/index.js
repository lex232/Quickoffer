class ApiMainProfile {
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
// главной странице профиля
/////////////////////////////////

  getMainProfileInfo () {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/profile-main/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
      }
    ).then(this.checkResponse)
  }

}

export default new ApiMainProfile(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })
