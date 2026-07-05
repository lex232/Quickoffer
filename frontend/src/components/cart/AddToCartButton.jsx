import { ShoppingBag, Minus, Plus, Trash2 } from 'react-feather';
import CheckSameCartItem from '../../utils/items/checkSameCartItem';
import CartPlusItem from '../../utils/items/cartPlusItem';
import CartRemoveItem from '../../utils/items/cartRemoveItem';
import './styles.css'

const AddToCartButton = ({ results, onCartChange }) => {
  let items = [];
  try {
    items = JSON.parse(localStorage.getItem("items")) || [];
  } catch { }

  const handleAdd = (e) => {
    CartPlusItem(results, items, e);
    if (onCartChange) onCartChange();
  };

  const handleRemove = (e) => {
    CartRemoveItem(results.id, items, e);
    if (onCartChange) onCartChange();
  };

  const handleQuantityChange = (action, e) => {
    e.preventDefault();
    let currentItems = JSON.parse(localStorage.getItem("items")) || [];
    const index = currentItems.findIndex(item => item.id === results.id);
    if (index === -1) return;
    let amount = Number(currentItems[index].amount);
    if (action === 'minus' && amount > 1) amount -= 1;
    else if (action === 'plus') amount += 1;
    currentItems[index].amount = String(amount);
    localStorage.setItem("items", JSON.stringify(currentItems));
    window.dispatchEvent(new Event("storage"));
    if (onCartChange) onCartChange();
  };

  const handleQuantityInput = (e) => {
    let currentItems = JSON.parse(localStorage.getItem("items")) || [];
    const index = currentItems.findIndex(item => item.id === results.id);
    if (index === -1) return;
    let val = e.target.value.replace(/\D/g, '');
    if (val === '' || Number(val) < 1) val = '1';
    currentItems[index].amount = val;
    localStorage.setItem("items", JSON.stringify(currentItems));
    window.dispatchEvent(new Event("storage"));
    if (onCartChange) onCartChange();
  };

  const inCart = CheckSameCartItem(results.id, items);
  const currentItem = items.find(i => i.id === results.id);

  if (!inCart) {
    return (
      <button className="cart-add-btn" onClick={handleAdd}>
        <ShoppingBag size={15} />
        Добавить
      </button>
    );
  }

  return (
    <div className="d-flex align-items-center gap-1">
      <button className="cart-qty-btn" onClick={(e) => handleQuantityChange('minus', e)}>
        <Minus size={13} />
      </button>
      <input
        className="cart-qty-input"
        value={currentItem?.amount || 1}
        onChange={handleQuantityInput}
      />
      <button className="cart-qty-btn" onClick={(e) => handleQuantityChange('plus', e)}>
        <Plus size={13} />
      </button>
      <button className="cart-icon-btn cart-icon-btn--danger ms-1" onClick={handleRemove} title="Удалить">
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default AddToCartButton;
