class ApiOffer {
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
// API запросы с КП
/////////////////////////////////

createOffer ({
  title,
  client,
  status_type,
  items_for_offer
}) {
  const token = localStorage.getItem('token')
  return fetch(
    '/api/offers/',
    {
      method: 'POST',
      headers: {
        ...this._headers,
        'authorization': `Token ${token}`
      },
      body: JSON.stringify({
        name_offer: title,
        name_client: client,
        status_type: status_type,
        items_for_offer
      })
    }
  ).then(this.checkResponse)
}

getOfferPaginate ({
  page
}) {
  return fetch(
    `/api/offers/?page=${page}`,
    {
      method: 'GET',
    }
  ).then(this.checkResponse)
}

}

export default new ApiOffer(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })
