import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

import FeedBackPopup from "../../../components/popup/FeedBackPopup";
import api from "../../../api";

function SoftList({ loginstate }) {
  // Функция отображения ПО
  const [softlist, setSoft] = useState([]);
  const [isLoaddingSoft, setIsLoaddingSoft] = useState(true);

  useEffect(() => {
    // Обновление данных
      getFreeSW();
    }, []);

  const getFreeSW = () => {
    // Получить список ПО
    api.getFreeSW()
    .then(res => {
      setSoft(res);
    })
    .catch((e) => console.log(e))
    .finally(()=> setIsLoaddingSoft(false))
  }


  const getLink = (id, link) => {
    // Получить ссылку на скачивание
    // если пользователь авторизован
    if (loginstate) {
      api.getDownloadLink({ soft_id: id })
      .then(res => {
        if (res.status === 200) {
          window.open(link)
        }
      })
      .catch((e) => console.log(e))
      getFreeSW();
    }
    else {
      // если пользователь НЕ авторизован
      api.getDownloadLinkWithoutAuth({ soft_id: id })
      .then(res => {
        if (res.status === 200) {
          window.open(link)
        }
      })
      .catch((e) => console.log(e))
      }
  }

  const HandleLinkSW = (e, id, link) => {
    // Кнопка создать ПО
    e.preventDefault();
    getLink(id, link)
  }

  const ShowFreeSoft = () => {
    // Отображает блоки общей информации
    return (
      <div className="container" id="featured-3">
        <div className="text-start">
          Устанавливайте свободно-распространяемое ПО
          Уважаемые сотрудники - экономьте средства предприятия, скачивайте свободно-распространяемое ПО только с внутреннего сайта института. В случае необходимости расширения списка - обращайтесь по тел. 22-67 Зам. рук. НПК-100 Донцову А.И.
          Теперь вы можете отправить заявку на расширение списка, сообщить об ошибке, или высказать свои предложения здесь! 
          <FeedBackPopup subject={'freesoft'} loginstate={loginstate} />
        </div>
        <div className="d-flex">
          {isLoaddingSoft && <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>}
        </div>
        {softlist.map((results) => {
          let items = results.freesoft
          if (items.length != 0) {
            return (
              <div className="container py-2">
                <h4 className="text-center">{results.title}</h4>
                <div className="row mb-3 text-center">
                {items.map((results) => {
                    if (results.visibility === "yes") {
                      return (
                        <div className="col-md-4 themed-grid-col" key={results.id}>
                            <div className="card text-center border-1 rounded-2 p-4">
                              <div className="icon">
                              <img className="mx-auto d-block" width="80em" height="80em" src={results.image} alt=""/>
                              </div>
                              <div className="card-body">
                                  <h4 className="card-title fw-bold">{results.title}</h4>
                                  <p className="card-text">{results.help}</p>
                                  <button onClick={(e) => HandleLinkSW(e, results.id, results.relate_file)} type="button" className="btn btn-sm btn-primary">скачать</button>
                              </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                  </div>
              </div>
            );
          }
        })}
      </div>
    )
  }

  return ([
        ShowFreeSoft()
      ]
    );
  }

export default SoftList;