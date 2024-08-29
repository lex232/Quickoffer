class ApiItemsGroup {
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

  getItemsGroup () {
    return fetch(
      `/api/groupsitems/`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

  getServiceGroup () {
    return fetch(
      `/api/groupservices/`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

  getItemsGroupOnCreateUserItem () {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/groupsoncreate`,
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

export default new ApiItemsGroup(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })
