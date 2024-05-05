import React, { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";

import items_api from '../../../api/items_api';

const ItemsArea = ({ category_id }) => {

    const [ listItems, setListItems ] = useState([])
    const [ isLoaddingItems, setIsLoaddingItems ] = useState(true);

    const [page, setPage] = useState(0);
    const [pageCount, setpageCount] = useState(0);
    let currentpage = 1;

    useEffect(() => {
        // Получить все новости при загрузке страницы
        getItems(currentpage, category_id);
        currentpage = 1;
      }, [category_id])
      ;

    const getItems = (page, category_id) => {
        // Получить список категорий товаров
        items_api.getItemsFilterCategoryPaginate({
            page: page,
            group: category_id
    })
        .then(res => {
            setpageCount(Math.ceil(res.count / 10));
            setListItems(res.results);
        })
        .catch((e) => console.log(e))
        .finally(()=> setIsLoaddingItems(false))
      }

    const handlePageClick = (data) => {
    // Обработать клик паджинатора
    setPage(data.selected + 1)
    currentpage = data.selected + 1;
    getItems(currentpage, category_id);
    };

    return (
        <div class="col-md-9">
            <div className="d-flex">
                {isLoaddingItems && <div className="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>}
            </div>
            <h2>Позиции</h2>

                <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
                    {listItems.map((results) => {
                        return (
                            <div className="col-md-4 themed-grid-col">
                                <div className="card h-100 text-center border-1 rounded-2 p-4">
                                    <img className="mx-auto d-block" src={results.image} height={200} width={200}></img>
                                    <div className="card-body">
                                        <h5 className="card-title">{results.title}</h5>
                                        <p className="card-text">{results.description}</p>
                                    </div>
                                    <div className="card-footer">
                                        <small className="text-muted">Цена: <b>{results.price_retail}</b> руб.</small>
                                    </div>
                                </div>
                          </div>
                            );
                        })}   
                </div>

                


            <ReactPaginate
                previousLabel={"предыдущая"}
                nextLabel={"следующая"}
                initialPage={page}
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
    
    export default ItemsArea;