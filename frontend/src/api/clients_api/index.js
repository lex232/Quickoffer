class ApiClients {
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
// API запросы с клиентами пользователя
/////////////////////////////////
  
  getClients () {
    return fetch(
      `/api/clients/`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

  createClient ({
    title,
    ogrn,
    inn,
    kpp,
    address_reg,
    address_post,
    bill_num,
    bill_corr_num,
    bank_name,
    image
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      '/api/clients/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          title,
          ogrn,
          inn,
          kpp,
          address_reg,
          address_post,
          bill_num,
          bill_corr_num,
          bank_name,
          image
        })
      }
    ).then(this.checkResponse)
  }

  updateClient ({
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
      `/api/clients/${section_id}/`,
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

  deleteClient ({ section_id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/clients/${section_id}/`,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }
  
  getClientsPaginate ({
    page
  }) {
    return fetch(
      `/api/clients/?page=${page}`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

}

export default new ApiClients(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })
