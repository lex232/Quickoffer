class UserApi {
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
// API запросы с пользователями
/////////////////////////////////

  signin ({ username, password }) {
    return fetch(
      '/api/auth/token/login/',
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          username, password
        })
      }
    ).then(this.checkResponse)
  }

  signout () {
    const token = localStorage.getItem('token')
    return fetch(
      '/api/auth/token/logout/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  getUserData () {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/me/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  getUserDataAll () {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/meall/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  getUsers ({
    page
  }) {
    return fetch(
      `/api/users/?page=${page}`,
      {
        method: 'GET',
      }
    ).then(this.checkResponse)
  }

  createUser ({ 
    email,
    username,
    first_name,
    lastname_area,
    password
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/`,
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          email,
          username,
          first_name,
          lastname_area,
          password
        })
      }
    ).then(this.checkResponse)
  }

  updateUser ({ 
    id,
    email,
    username,
    first_name,
    last_name,
    password
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/${id}/current/`,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          id,
          email,
          username,
          first_name,
          last_name,
          password
        })
      }
    ).then(this.checkResponse)
  }

  deleteUser ({ user_id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/${user_id}/current`,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }  

  updateProfile ({ 
    id,
    company_name,
    company_name_for_docs,
    company_type,
    image,
    ogrn,
    inn,
    kpp,
    address_reg,
    address_post,
    bill_num,
    bill_corr_num,
    bank_name,
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/profile/`,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          id,
          company_name,
          company_name_for_docs,
          company_type,
          image,
          ogrn,
          inn,
          kpp,
          address_reg,
          address_post,
          bill_num,
          bill_corr_num,
          bank_name,
        })
      }
    ).then(this.checkResponse)
  }

}

export default new UserApi(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })