import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from "react-paginate";

import TruncateText from "../../../utils/truncate";
import getDate from "../../../utils/getDate";

import calendar from '../../../static/image/icons/basic_calendar.svg'
import user_ico from '../../../static/image/icons/basic_rss.svg'

function News() {
  // Функция отображения новостей
  const [news, setNews] = useState([]);
  const [isLoadding, setIsLoadding] = useState(true);
  const [isLoaddingSingle, setIsLoaddingSingle] = useState(true);
  let currentpage = 1;
  const [page, setPage] = useState(1);
  const [pageCount, setpageCount] = useState(0);
  const [isSinglePage, setSingleNewFlag] = useState(false);
  const [SinglePageData, setSingleNew] = useState([]);

  useEffect(() => {
    // Получить все новости при загрузке страницы
    fetch("/api/news/?page=1")
      .then((res) => res.json())
      .then((data) => {
        setNews(data.results);
        setpageCount(Math.ceil(data.count / 10));
      })
      .catch((e) => console.log(e))
      .finally(()=> setIsLoadding(false))
  }, [])
  ;

  const fetchNews = async (page_input) => {
    // Получить все новости
    const res = await fetch(
      "/api/news/?page=" + page_input
    );
    const data = await res.json();
    return data.results;
  };

  const handlePageClick = async (data) => {
    // Обработать клик паджинатора
    setPage(data.selected + 1)
    currentpage = data.selected + 1;
    const NewsFromServer = await fetchNews(currentpage);
    setNews(NewsFromServer);
  };

  const fetchSingleNew = async (currentpage) => {
    // Получить одну новость
    const res = await fetch(
      "/api/news/" + currentpage + "/"
    );
    const data = await res.json();
    setSingleNew(data);
    setIsLoaddingSingle(false);
  };

  function handleNextCLiсk(id, e) {
    // Обработать клик по одиночной записи
    e.preventDefault();
    fetchSingleNew(id)
    setSingleNewFlag(true)
  }

  function handleBackCLiсk(e) {
    // Обработать клик назад в одиночной записи
    e.preventDefault();
    setSingleNewFlag(false)
    setSingleNew([])
  }

  const AllNews = () => {
    // Отображает все новости
    return (
      <div className="container">
      <div className="row m-2">
        <div className="d-flex">
          {isLoadding && <div className="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>}
        </div>
        {news.map((results) => {
            return (
              <div key={results.id} className="col-sm-12 col-md-12 v my-2">
                <div className="card w-100">
                  <div className="card-body text-start">
                    <h5 className="card-title h4">{results.title} </h5>
                    <div className="text-muted d-flex justify-content-end  mt-2 mb-2">
                      <img className="d-inline me-2 mt-1" width="18" src={calendar} alt=""/>
                      Дата: {getDate(results.pub_date)}
                      <img className="d-inline me-2 ms-2" width="18" src={user_ico} alt=""/>
                      Автор: {results.author}
                    </div>
                    <div className="d-flex">
                      {results.image && <img className="col-2 me-2 mt-1" width="100" src={results.image} alt=""/>}
                      <p className="col card-text">{TruncateText(results.description)}</p>
                    </div>
                    <button onClick={(e) => handleNextCLiсk(results.id, e)} class="btn btn-primary btn-sm float-end">Читать далее</button>
                  </div>
                </div>
              </div>
            );
          })}
     </div>

     <ReactPaginate
        previousLabel={"предыдущая"}
        nextLabel={"следующая"}
        initialPage={page - 1}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>      
    );
  };

  const SingleNew = () => {
    // Отображает одиночную новость

      return (
        <div className="container">
           <div className="row">
            <div className="col mx-4">
              <button onClick={(e) => handleBackCLiсk(e)} className="btn btn-primary btn-sm float-end">Назад</button>
            </div>
          </div>
          <div className="row m-2">
            <div className="d-flex">
              {isLoaddingSingle && <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>}
            </div>
            {SinglePageData.pub_date && SinglePageData.description && 
              <div className="col-sm-12 col-md-12 v my-2">
                <div className="card w-100">
                  <div className="card-body text-start">
                    <h5 className="card-title h4">{SinglePageData.title} </h5>
                    <div className="text-muted d-flex justify-content-end mt-2 mb-2">
                      <img className="d-inline me-2 mt-1" width="18" src={calendar} alt=""/>
                      Дата публикации: {getDate(SinglePageData.pub_date)}
                      <img className="d-inline me-2 ms-2" width="18" src={user_ico} alt=""/>
                      Автор: {SinglePageData.author}
                    </div>
                    <div className="d-flex">
                      {SinglePageData.image && <img className="col-2 me-2 mt-1" width="100" src={SinglePageData.image} alt=""/>}
                      <p className="card-text" style={{ whiteSpace: 'pre-wrap'}}>{SinglePageData.description}</p>
                    </div>
                  </div>
                </div>
              </div>}
          </div>
        </div> 
      );
  };

  if (isSinglePage === false) {
    return (
      AllNews()
    );
  } else {
    return (
      SingleNew()
    );
  }
}

export default News;
