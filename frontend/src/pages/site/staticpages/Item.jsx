import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactQuill from "react-quill";

import staticpage_api from "../../../api/staticpage_api";
import 'react-quill/dist/quill.bubble.css'

import getDate from "../../../utils/getDate";

import calendar from '../../../static/image/icons/basic_calendar.svg'
import user_ico from '../../../static/image/icons/basic_rss.svg'

function StaticItem({ item }) {
  // Функция отображения разделов
  const [static_item, setStaticItem] = useState([]);
  const [isLoaddingStatic, setIsLoaddingStatic] = useState(true);

  useEffect(() => {
      // Получить все разделы при загрузке страницы
      getStatic();
    }, [], []);

  const getStatic = () => {
    staticpage_api.getStaticPageOnSlug({
      item: item,
    })
    .then(res => {
      setStaticItem(res);
    })
    .catch((e) => console.log(e))
    .finally(()=> setIsLoaddingStatic(false))
  }

  
  return ([
    <div>
      <div className="d-flex">
        {isLoaddingStatic && <div className="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>}
      </div>
      <div className="col-sm-12 col-md-12 v my-2">
        <div className="card w-100">
          <div className="card-body text-start">
            <h5 className="card-title h4">{static_item.title} </h5>
            <div className="text-muted d-flex justify-content-end mt-2 mb-2">
              <img className="d-inline me-2 mt-1" width="18" src={calendar} alt=""/>
              Дата публикации: {getDate(static_item.pub_date)}
              <img className="d-inline me-2 ms-2" width="18" src={user_ico} alt=""/>
              Автор: {static_item.author}
            </div>
            <div className="d-flex">
              <ReactQuill
                value={static_item.content}
                readOnly={true}
                theme={"bubble"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    ]
  );
}

export default StaticItem;
