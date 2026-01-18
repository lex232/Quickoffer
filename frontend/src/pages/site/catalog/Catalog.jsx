import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '../includes/Header.jsx';
import Footer from '../includes/Footer.jsx';
import ItemsArea from '../items-area/ItemsArea.jsx';
import ItemCard from '../items-area/ItemCard.jsx';

import group_api from '../../../api/group_api';
import { AlignJustify, XCircle, Menu } from 'react-feather';
import './styles.css'


const CatalogPage = ({ loginstate, onSignOut, user }) => {
    /**
    * Страница каталога
    */
    const { slug } = useParams();

    const [listGroups, setListGroups] = useState([])
    const [listService, setListService] = useState([])
    const [isLoadingCat, setIsLoadingCat] = useState(true)
    const [chosenCategory, setChosenCategory] = useState(undefined)
    const [chosenTree, setChosenTree] = useState(undefined)
    const [chosenTitle, setChosenTitle] = useState(undefined)
    const [chosenDescription, setChosenDescription] = useState(undefined)
    const [singleItem, setSingleItem] = useState(null);
    const [itemError, setItemError] = useState(null);
    const [loadingSingleItem, setLoadingSingleItem] = useState(false);

    const style_visible = "col-md-3 col-lg-2 d-md-block sidebar sidebar-custom collapse"
    const style_non_visible = "col-md-3 col-lg-2 d-md-block sidebar sidebar-custom"

    const [isCollapsed, setIsCollapsed] = useState(style_visible)
    const navigate = useNavigate();

    useEffect(() => {
        // Получить все группы при загрузке страницы
        getGroups();
        getGroupService();
    }, [])
        ;

    // Если есть slug — загружаем товар
    useEffect(() => {
        if (slug) {
            loadSingleItem(slug);
        }
    }, [slug]);

    const loadSingleItem = async (itemSlug) => {
        setLoadingSingleItem(true);
        setItemError(null);
        setSingleItem(null);

        try {
            const item = await group_api.getItemBySlug(itemSlug);
            setSingleItem(item);
            setItemError(null);
        } catch (err) {
            console.error('Ошибка загрузки товара:', err);
            setSingleItem(null);
            setItemError(err);
        } finally {
            setLoadingSingleItem(false);
        }
    };

    const getGroups = () => {
        group_api.getItemsGroup()
            .then(res => {
                setListGroups(res);
                // Устанавливаем первую категорию ТОЛЬКО если chosenCategory ещё не задан
                if (res.length > 0 && chosenCategory == null) {
                    setChosenCategory(res[0].id);
                    setChosenTree(res[0].tree_id);
                    setChosenTitle(res[0].title);
                    setChosenDescription(res[0].description);
                }
            })
            .catch(e => console.log(e))
            .finally(() => setIsLoadingCat(false));
    };

    const getGroupService = () => {
        // Получить список категорий услуг
        group_api.getServiceGroup()
            .then(res => {
                setListService(res);
            })
            .catch((e) => console.log(e))
            .finally(() => setIsLoadingCat(false))
    }

    const handleChangeCategory = (e, id, tree_id, title, description) => {
        // Устанавливаем значение типа компании onChange
        e.preventDefault();
        setChosenCategory(id);
        setChosenTree(tree_id);
        setChosenTitle(title)
        setChosenDescription(description)
        setSingleItem(null);
        navigate('/catalog');
    }

    const handleMenu = (e) => {
        // Прячет меню
        e.preventDefault();
        if (isCollapsed === style_visible) {
            setIsCollapsed(style_non_visible)
        }
        else { setIsCollapsed(style_visible) }
    }

    const CategoryView = ({ InputGroups }) => {
        return (
            <>
                {InputGroups.map((results) => {
                    return (
                        results.level === 0
                        &&
                        <div className="sidebar-heading d-flex align-items-center fw-bold text-muted item-sidebar-catalog px-3" data-bs-toggle="collapse" data-bs-target="#general-collapse" aria-expanded="false">
                            <span className='position-absolute end-0'></span>
                            <button onClick={(e) => handleChangeCategory(e, results.id, results.tree_id, results.title, results.description)}>
                                {results.id === chosenCategory ? <li className="nav-link active text-sidebar button-mini">{results.title}</li> : <li className="nav-item text-sidebar">{results.title}</li>}
                            </button>
                        </div>
                        ||
                        chosenTree === results.tree_id && results.level !== 0
                        &&
                        <button onClick={(e) => handleChangeCategory(e, results.id, results.tree_id, results.title, results.description)}>
                            {results.id === chosenCategory ? <li className="nav-link active small-item button-mini"> --- {results.title}</li> : <li className="nav-item small-item"> --- {results.title}</li>}
                        </button>
                    );
                })}
            </>
        )
    }

    const MyItems = ({ }) => {
        return (
            <div className="sidebar-heading d-flex align-items-center fw-bold text-muted item-sidebar-catalog px-3">
                <button onClick={(e) => handleChangeCategory(e, -1, 0, 'Мои товары')}>
                    {-1 === chosenCategory ? <li className="nav-link active text-sidebar button-mini">Мои товары</li> : <li className="nav-item text-sidebar">Мои товары</li>}
                </button>
            </div>
        )
    }

    return (
        <div>
            <div className="container-fluid">
                <Header loginstate={loginstate} onSignOut={onSignOut} user={user} />
            </div>
            <div className="d-flex">
                {isLoadingCat && <div className="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>}
            </div>
            <Helmet>
                <title>OfferGuru - каталог товаров</title>
                <meta name="description" content="Готовый каталог товаров, который можно использовать для быстрого создания КП, договора, торг-12 и других документов" />
            </Helmet>
            <div className="container-fluid">
                <div className="row">
                    <div>
                        <button className='button-on-mobile ps-3 pb-2' onClick={(e) => handleMenu(e)}>
                            {style_visible === isCollapsed ? <><AlignJustify /> показать категории</> : <><XCircle /> скрыть категории</>}
                        </button>
                    </div>
                    <nav id="sidebarMenu" className={isCollapsed}>
                        <div className="position-sticky pt-3 sidebar-sticky mb-2">
                            <h3 className='header-category'><Menu /> Категории</h3>
                            <ul className="nav nav-pills flex-column gap-2">
                                <CategoryView InputGroups={listGroups} />
                                <br></br>
                                <CategoryView InputGroups={listService} />
                                <br></br>
                                {loginstate && <MyItems />}
                            </ul>
                        </div>
                    </nav>
                    {slug && (
                        <ItemCard
                            item={singleItem}
                            loading={loadingSingleItem}
                            error={!!itemError}
                            onBack={() => {
                                setSingleItem(null);
                                setItemError(null);
                                if (chosenCategory == null) {
                                    getGroups();
                                    getGroupService();
                                }
                                navigate('/catalog');
                            }}
                        />
                    )}
                    {chosenCategory && !slug && <ItemsArea category_id={chosenCategory} loginstate={loginstate} title={chosenTitle} description={chosenDescription} />}
                </div>
            </div>

            <div className="container-fluid">
                <Footer />
            </div>

        </div>
    );
};

export default CatalogPage;