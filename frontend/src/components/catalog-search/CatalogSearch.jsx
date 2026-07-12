import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag } from 'react-feather';
import items_api from '../../api/items_api';
import CartPlusItem from '../../utils/items/cartPlusItem';
import CheckSameCartItem from '../../utils/items/checkSameCartItem';
import './catalogSearch.css';

const CatalogSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        try { return JSON.parse(localStorage.getItem('items')) || []; }
        catch { return []; }
    });
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const onStorage = () => {
            try { setCartItems(JSON.parse(localStorage.getItem('items')) || []); }
            catch { setCartItems([]); }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const search = useCallback((value) => {
        if (!value || value.length < 1) {
            setResults([]);
            setIsOpen(false);
            return;
        }
        setLoading(true);
        items_api.findItem({ item: value })
            .then(res => {
                setResults(res.slice(0, 5));
                setIsOpen(true);
            })
            .catch(() => {
                setResults([]);
                setIsOpen(false);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(value), 300);
    };

    const handleAddToCart = (item, e) => {
        e.stopPropagation();
        const currentItems = JSON.parse(localStorage.getItem('items')) || [];
        if (!CheckSameCartItem(item.id, currentItems)) {
            CartPlusItem(item, currentItems, e);
            setCartItems(JSON.parse(localStorage.getItem('items')) || []);
        }
    };

    const handleItemClick = (slug) => {
        navigate(`/catalog/${slug}`);
        setIsOpen(false);
        setQuery('');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const formatPrice = (price) => {
        if (!price) return '';
        return Number(price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
    };

    return (
        <div className="catalog-search" ref={wrapperRef}>
            <div className="catalog-search-wrap">
                <Search size={15} className="catalog-search-icon" />
                <input
                    className="catalog-search-input"
                    type="text"
                    placeholder="Найти товар..."
                    value={query}
                    onChange={handleChange}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                />
                {loading && <span className="catalog-search-spinner" />}
            </div>

            {isOpen && results.length > 0 && (
                <div className="catalog-search-dropdown">
                    {results.map(item => {
                        const inCart = CheckSameCartItem(item.id, cartItems);
                        const title = item.brand ? `${item.title} ${item.brand}` : item.title;
                        return (
                            <div
                                key={item.id}
                                className="catalog-search-item"
                                onClick={() => handleItemClick(item.slug)}
                            >
                                {item.image && (
                                    <img
                                        className="catalog-search-item-img"
                                        src={item.image}
                                        alt={title}
                                    />
                                )}
                                <div className="catalog-search-item-info">
                                    <span className="catalog-search-item-title">{title}</span>
                                    {item.price_retail && (
                                        <span className="catalog-search-item-price">{formatPrice(item.price_retail)}</span>
                                    )}
                                </div>
                                <button
                                    className={`catalog-search-cart-btn ${inCart ? 'in-cart' : ''}`}
                                    onClick={(e) => handleAddToCart(item, e)}
                                    title={inCart ? 'Уже в корзине' : 'Добавить в корзину'}
                                >
                                    <ShoppingBag size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {isOpen && query && results.length === 0 && !loading && (
                <div className="catalog-search-dropdown">
                    <div className="catalog-search-empty">Ничего не найдено</div>
                </div>
            )}
        </div>
    );
};

export default CatalogSearch;
