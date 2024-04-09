class ApiItems {
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
// API запросы с товарами пользователя
/////////////////////////////////
  
  getItems () {
    return fetch(
      `/api/items/`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

  createItem ({
    title,
    help,
    image,
    status_type,
    pre_link,
    link,
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      '/api/items/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          title,
          help,
          image,
          status_type,
          pre_link,
          link
        })
      }
    ).then(this.checkResponse)
  }

  updateItem ({
    section_id,
    title,
    help,
    image,
    status_type,
    pre_link,
    link,
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/items//${section_id}/`,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          id: section_id,
          title,
          help,
          image,
          status_type,
          pre_link,
          link
        })
      }
    ).then(this.checkResponse)
  }

  deleteItem ({ section_id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/items/${section_id}/`,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }
  
  getItemsPaginate ({
    page
  }) {
    return fetch(
      `/api/items/?page=${page}`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

}

export default new ApiItems(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })
