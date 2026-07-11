import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '../includes/Header.jsx';
import Footer from '../includes/Footer.jsx';
import ItemsArea from '../items-area/ItemsArea.jsx';
import ItemCard from '../items-area/ItemCard.jsx';

import group_api from '../../../api/group_api';
import { AlignJustify, X, Menu } from 'react-feather';
import './styles.css'


const CatalogPage = ({ loginstate, onSignOut, user }) => {
    const { slug } = useParams();

    const [listGroups, setListGroups] = useState([])
    const [listService, setListService] = useState([])
    const [isLoadingCat, setIsLoadingCat] = useState(true)
    const [chosenCategory, setChosenCategory] = useState(undefined)
    const [chosenTree, setChosenTree] = useState(undefined)
    const [chosenTitle, setChosenTitle] = useState(undefined)
    const [chosenDescription, setChosenDescription] = useState(undefined)
    const [chosenType, setChosenType] = useState(undefined)
    const [singleItem, setSingleItem] = useState(null);
    const [itemError, setItemError] = useState(null);
    const [loadingSingleItem, setLoadingSingleItem] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

    const navigate = useNavigate();

    useEffect(() => {
        getGroups();
        getGroupService();
    }, []);

    useEffect(() => {
        if (slug) {
            loadSingleItem(slug);
        }
    }, [slug]);

    useEffect(() => {
        if (singleItem && listGroups.length > 0) {
            const lastGroup = singleItem.group?.[singleItem.group.length - 1];
            if (lastGroup) {
                const foundInGroups = listGroups.find(g => g.id === lastGroup.id);
                const foundInService = listService.find(s => s.id === lastGroup.id);
                const found = foundInGroups || foundInService;

                if (found) {
                    setChosenCategory(found.id);
                    setChosenTree(found.tree_id);
                    setChosenTitle(found.title);
                    setChosenDescription(found.description);
                    setChosenType(foundInService ? 'service' : 'product');
                }
            }
        }
    }, [singleItem, listGroups, listService]);

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
                if (res.length > 0 && chosenCategory == null && !slug) {
                    setChosenCategory(res[0].id);
                    setChosenTree(res[0].tree_id);
                    setChosenTitle(res[0].title);
                    setChosenDescription(res[0].description);
                    setChosenType('product');
                }
            })
            .catch(e => console.log(e))
            .finally(() => setIsLoadingCat(false));
    };

    const getGroupService = () => {
        group_api.getServiceGroup()
            .then(res => {
                setListService(res);
            })
            .catch((e) => console.log(e))
            .finally(() => setIsLoadingCat(false))
    }

    const handleChangeCategory = (e, id, tree_id, title, description) => {
        e.preventDefault();
        setChosenCategory(id);
        setChosenTree(tree_id);
        setChosenTitle(title)
        setChosenDescription(description)
        setSingleItem(null);
        const foundInService = listService.some(g => g.id === id);
        setChosenType(foundInService ? 'service' : 'product');
        navigate('/catalog');
    }

    const renderTree = (items, prefix) => {
        if (!items || items.length === 0) return null;

        return items.map(item => {
            if (item.level === 0) {
                return (
                    <button
                        key={`${prefix}-${item.id}`}
                        className={`catalog-link ${item.id === chosenCategory ? 'active' : ''}`}
                        onClick={(e) => handleChangeCategory(e, item.id, item.tree_id, item.title, item.description)}
                    >
                        <span>{item.title}</span>
                    </button>
                );
            }
            if (chosenTree === item.tree_id) {
                return (
                    <button
                        key={`${prefix}-${item.id}`}
                        className={`catalog-link catalog-link--child ${item.id === chosenCategory ? 'active' : ''}`}
                        onClick={(e) => handleChangeCategory(e, item.id, item.tree_id, item.title, item.description)}
                    >
                        {item.title}
                    </button>
                );
            }
            return null;
        });
    };

    const selectMyProducts = (e) => {
        e.preventDefault();
        setChosenCategory(-1);
        setChosenTree(0);
        setChosenTitle('Мои товары');
        setChosenDescription('');
        setChosenType('product');
        setSingleItem(null);
        navigate('/catalog');
    };

    const selectMyServices = (e) => {
        e.preventDefault();
        setChosenCategory(-2);
        setChosenTree(0);
        setChosenTitle('Мои услуги');
        setChosenDescription('');
        setChosenType('service');
        setSingleItem(null);
        navigate('/catalog');
    };

    return (
        <div className="catalog-wrap">
            <Header loginstate={loginstate} onSignOut={onSignOut} user={user} />
            <button className="catalog-toggle" onClick={() => setSidebarOpen(prev => !prev)}>
                {sidebarOpen ? <X size={18} /> : <AlignJustify size={18} />}
            </button>

            <Helmet>
                <title>OfferGuru - каталог товаров</title>
                <meta name="description" content="Готовый каталог товаров для быстрого создания КП, договора, торг-12 и других документов" />
            </Helmet>

            <div className="catalog-body">
                {isLoadingCat && <div className="spinner-border text-primary catalog-loading"><span className="visually-hidden">Загрузка...</span></div>}

                {sidebarOpen && <div className="catalog-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
                <aside className={`catalog-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="catalog-sidebar-inner">
                        <span className="catalog-sidebar-heading"><Menu size={14} /> Категории</span>
                        {renderTree(listGroups, 'g')}

                        {listService.length > 0 && (
                            <>
                                <div className="catalog-sidebar-divider" />
                                <span className="catalog-sidebar-heading">Услуги</span>
                                {renderTree(listService, 's')}
                            </>
                        )}

                        {loginstate && (
                            <>
                                <div className="catalog-sidebar-divider" />
                                <button
                                    className={`catalog-link ${-1 === chosenCategory ? 'active' : ''}`}
                                    onClick={selectMyProducts}
                                >
                                    Мои товары
                                </button>
                                <button
                                    className={`catalog-link ${-2 === chosenCategory ? 'active' : ''}`}
                                    onClick={selectMyServices}
                                >
                                    Мои услуги
                                </button>
                            </>
                        )}
                    </div>
                </aside>

                <div className="catalog-content-area">
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
                    {chosenCategory && !slug && <ItemsArea category_id={chosenCategory} loginstate={loginstate} title={chosenTitle} description={chosenDescription} item_type={chosenType} />}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CatalogPage;
