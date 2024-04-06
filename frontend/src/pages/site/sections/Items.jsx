import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import sections_api from "../../../api/sections_api";
import modules_api from "../../../api/modules_api";

function Items() {
  // Функция отображения разделов
  const [sections, setSections] = useState([]);
  const [sectionsCategory, setSectionsCategory] = useState([]);
  const [isLoaddingSections, setIsLoaddingSections] = useState(true);
  const [isLoaddingSectionsCategory, setIsLoaddingSectionsCategory] = useState(true);

  useEffect(() => {
      // Получить все разделы при загрузке страницы
      getSections();
      getSectionsCategory();
    }, [], []);

  const getSectionsCategory = () => {
    sections_api.getSectionsCategory()
    .then(res => {
      setSectionsCategory(res);
    })
    .catch((e) => console.log(e))
    .finally(()=> setIsLoaddingSectionsCategory(false))
  }

  const getSections = () => {
    modules_api.getPageSection()
    .then(res => {
      setSections(res);
    })
    .catch((e) => console.log(e))
    .finally(()=> setIsLoaddingSections(false))
  }

  const ShowInfoSections = ({name_section, check_type}) => {
    // Отображает блоки разделов по категориям
    return (
      <div className="container" id="featured-3">
        <div className="d-flex">
          {isLoaddingSections && <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>}
        </div>
        <h4 className="pb-2 text-start fw-bold">{name_section}</h4>
          <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
            {sections.map((results) => {
              if (results.item.status_type===check_type) {
                return (
                    <div key={results.id} className="feature col">
                      <div className="feature-icon d-inline-flex align-items-center justify-content-center fs-2 mb-3">
                        <img className="" width="40em" height="40em" src={results.item.image} alt=""/>
                      </div>
                      <h6 className="fs-5">{results.item.title}</h6>
                      <p className="text-muted">{results.item.help}</p>
                      {results.item.pre_link ? <a href={results.item.pre_link + results.item.link} className="">Перейти</a> : <a href={results.item.link} className="">Перейти</a> }
                    </div>
                );
              }
            })}
        </div>
      </div>
    )
  }
  
  return ([
    <div>
      <div className="d-flex">
        {isLoaddingSectionsCategory && <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>}
      </div>
      {sectionsCategory.map((results) => {
        return (
          <ShowInfoSections
            name_section={results.title}
            check_type={results.slug}
          />
        )
        })}
    </div>
    ]
  );
}

export default Items;
