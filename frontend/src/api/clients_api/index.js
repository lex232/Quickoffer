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
    const token = localStorage.getItem('token')
    return fetch(
      `/api/clients/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
      }
    ).then(this.checkResponse)
  }

  createClient ({
    title,
    company_type,
    ogrn,
    inn,
    kpp,
    address_reg,
    address_post,
    bill_num,
    bill_corr_num,
    bank_name,
    phone_company,
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
          company_type,
          ogrn,
          inn,
          kpp,
          address_reg,
          address_post,
          bill_num,
          bill_corr_num,
          bank_name,
          phone_company,
          image
        })
      }
    ).then(this.checkResponse)
  }

  updateClient ({
    id,
    title,
    company_type,
    ogrn,
    inn,
    kpp,
    address_reg,
    address_post,
    bill_num,
    bill_corr_num,
    bank_name,
    phone_company,
    image
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/clients/${id}/`,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          id,
          title,
          company_type,
          ogrn,
          inn,
          kpp,
          address_reg,
          address_post,
          bill_num,
          bill_corr_num,
          bank_name,
          phone_company,
          image
        })
      }
    ).then(this.checkResponse)
  }

  deleteClient ({ client_id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/clients/${client_id}/`,
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
    page,
    type_company,
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/clients/?page=${page}&company_type=${type_company}`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
      }
    ).then(this.checkResponse)
  }

  // Поиск по вхождению сначала
  findClient ({ client }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/clientsfinder/?client=${client}`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

}

export default new ApiClients(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })
