import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from "react-paginate";

import clients_api from '../../../api/clients_api';
import DeletePopup from '../../../components/popup/DeletePopup';
import ReadCompanyType from '../../../utils/text-operations/replaceClientType';

import { ReactComponent as PencilIco } from '../../../static/image/icons/pencil.svg'
import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'
import { Target, UserCheck, Briefcase, Folder, PlusSquare, Home, Phone } from 'react-feather'
import './styles.css'


const ClientDashboard = () => {
  /**
  * Страница клиентов пользователя
  */

  const navigate = useNavigate()

  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setpageCount] = useState(0);

  const [type_company, setTypeCompany] = useState('');

  let currentpage = 1;

  useEffect(() => {
    // Получить все новости при загрузке страницы
    getClients(currentpage, type_company);
  }, [])
  ;

  useEffect(() => {
    // Получить все новости при загрузке страницы
    getClients(currentpage, type_company);
  }, [type_company]);

  const getClients = (page, type_company) => {
    clients_api.getClientsPaginate({
      page: page,
      type_company: type_company,
    })
    .then(res => {
      setpageCount(Math.ceil(res.count / 10));
      setClients(res.results);
    })
    .catch((e) => console.log(e))
}

  const handlePageClick = (data) => {
    // Обработать клик паджинатора
    setPage(data.selected + 1)
    currentpage = data.selected + 1;
    getClients(currentpage, type_company);
  };

  const HandleDelClient = async (id) => {
    await clients_api.deleteClient({ client_id: id, })
      .then(res => {
        console.log(res)
      })
    await getClients(currentpage, type_company);
  }

  const handleChangeCompanyType = (e, val) => {
    e.preventDefault();
    setTypeCompany(val)
  }

  const HandleEditClient = async (
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
    image,
    e) => {
      e.preventDefault();
      return navigate("/profile/clients/edit", {state: {
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
      }})
  }

  const CreateClient = (e) => {
    e.preventDefault();
    return navigate("/profile/clients/create")
  }

  return (
    <main className="col-md-9 col-lg-10 px-md-4 profile-body">

    <div className="container-fluid">
        <div className="page-title">
          <div className="row">
            <div className="col-sm-6 my-3 text-start ps-4">
              <h3>Список моих клиентов</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 project-list">
          <div className="card-header">
            <div className="row">
              <div className="col-md-9 p-0 d-flex">
                <ul className="nav nav-tabs border-tab" id="top-tab" role="tablist">
                  <li className="nav-item"><a className="nav-link active" id="top-home-tab" data-bs-toggle="tab" href="#top-home" role="tab" aria-controls="top-home" aria-selected="true" onClick={(e) => setTypeCompany('')}><Target />Все</a></li>
                  <li className="nav-item"><a className="nav-link" id="ip-items-tab" data-bs-toggle="tab" href="#top-ip" role="tab" aria-controls="top-ip" aria-selected="false" onClick={(e) => setTypeCompany('ip')}><Briefcase />ИП</a></li>
                  <li className="nav-item"><a className="nav-link" id="ooo-top-tab" data-bs-toggle="tab" href="#top-ooo" role="tab" aria-controls="top-ooo" aria-selected="false" onClick={(e) => setTypeCompany('ooo')}><Folder />ООО</a></li>
                  <li className="nav-item"><a className="nav-link" id="fiz-top-tab" data-bs-toggle="tab" href="#top-fiz" role="tab" aria-controls="top-fiz" aria-selected="false" onClick={(e) => setTypeCompany('fiz')}><UserCheck />Физическое лицо</a></li>
                </ul>
              </div>
              <div className="col-md-3 p-0">                    
                <div className="form-group mb-0 me-0"></div><button onClick={(e) => CreateClient(e)} className='btn btn-primary btn-create' type="button"><PlusSquare size={16} className='me-2' />Добавить клиента</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12 project-list">
        <div className="card-header">
            <div className="mt-3">  
                  {clients.map((results) => {
                    return (
                      <div class="row text-start my-2 mx-0" key={results.id}>
                        <div class="col-10 my-0 mx-0">
                          <div class="row my-0 mx-0">
                            <div class="col-md-4">
                              <label>{ReadCompanyType(results.company_type)}: <b>{results.title}</b></label>
                            </div>
                            <div class="col-md-3">
                              <label><Home size='16px' color='gray'/> {results.address_reg}</label>
                            </div>
                            <div class="col-md-2">
                              {results.phone_company && <label><Phone size='16px' color='gray'/> {results.phone_company}</label>}
                            </div>
                          </div>
                        </div>
                        <div class="col-2 my-0 mx-0">
                          <label><button onClick={(e) => HandleEditClient(
                          results.id,
                          results.title,
                          results.company_type,
                          results.ogrn,
                          results.inn,
                          results.kpp,
                          results.address_reg,
                          results.address_post,
                          results.bill_num,
                          results.bill_corr_num,
                          results.bank_name,
                          results.phone_company,
                          results.image,
                          e)}><PencilIco fill="orange"/></button>
                          <label className=''><DeletePopup InputIcon={DeleteIco} color="red" name={results.title} action={HandleDelClient} id={results.id}/></label>
                          </label>
                        </div>


                        <hr className='mt-2'></hr>
                      </div>
                      );
                    })}
             


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
        </div>
      </div>

    </main>
  );
};

export default ClientDashboard;
