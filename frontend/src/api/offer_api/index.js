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

    // Проверка ответа, если возвращается файл в content-disposition
    checkFileDownloadResponsePdf (res) {
      return new Promise((resolve, reject) => {
        if (res.status < 400) {
          const filename_test = res.headers
          .get('content-disposition')
          .split('filename=')[1]
          console.log(filename_test)
          const filename = 'offer'+ filename_test +'.pdf'

          return res.blob().then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
          })
        }
        reject()
      })
    }

    // Проверка ответа, если возвращается файл в content-disposition
    checkFileDownloadResponseWord (res) {
      return new Promise((resolve, reject) => {
        if (res.status < 400) {
          const filename_test = res.headers
          .get('content-disposition')
          .split('filename=')[1]
          const filename = 'offer'+ filename_test +'.doc'

          return res.blob().then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
          })
        }
        reject()
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

deleteOffer ({ offer_id }) {
  const token = localStorage.getItem('token')
  return fetch(
    `/api/offers/${offer_id}/`,
    {
      method: 'DELETE',
      headers: {
        ...this._headers,
        'authorization': `Token ${token}`
      }
    }
  ).then(this.checkResponse)
}

getOfferPaginate ({
  page,
  status
}) {
  const token = localStorage.getItem('token')
  return fetch(
    `/api/offers/?page=${page}&status_type=${status}`,
    {
      method: 'GET',
      headers: {
        ...this._headers,
        'authorization': `Token ${token}`
      }
    }
  ).then(this.checkResponse)
}

getCurrentOffer ({
  id
}) {
  const token = localStorage.getItem('token')
  return fetch(
    `/api/offers/${id}/`,
    {
      method: 'GET',
      headers: {
        ...this._headers,
        'authorization': `Token ${token}`
      }
    }
  ).then(this.checkResponse)
}

downloadOffer ({
  id
}) {
  const token = localStorage.getItem('token')
  return fetch(
    `/api/offers/${id}/download_pdf/`,
    {
      method: 'GET',
      headers: {
        ...this._headers,
        'authorization': `Token ${token}`
      }
    }
  ).then(this.checkFileDownloadResponsePdf)
}

downloadBillWork ({
  id
}) {
  const token = localStorage.getItem('token')
  return fetch(
    `/api/offers/${id}/download_bill_work/`,
    {
      method: 'GET',
      headers: {
        ...this._headers,
        'authorization': `Token ${token}`
      }
    }
  ).then(this.checkFileDownloadResponseWord)
}

downloadBillItems ({
  id
}) {
  const token = localStorage.getItem('token')
  return fetch(
    `/api/offers/${id}/download_bill_items/`,
    {
      method: 'GET',
      headers: {
        ...this._headers,
        'authorization': `Token ${token}`
      }
    }
  ).then(this.checkFileDownloadResponseWord)
}

}

export default new ApiOffer(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })
