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
    description,
    group,
    price_retail,
    quantity_type,
    item_type,
    image,
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
          description,
          group,
          price_retail,
          quantity_type,
          item_type,
          image,
        })
      }
    ).then(this.checkResponse)
  }

  updateItem ({
    item_id,
    title,
    description,
    group,
    price_retail,
    quantity_type,
    item_type,
    image,
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/items/${item_id}/`,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          id: item_id,
          title,
          description,
          group,
          price_retail,
          quantity_type,
          item_type,
          image,
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