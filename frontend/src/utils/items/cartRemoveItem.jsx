const CartRemoveItem = (id_item, items_input, e) => {
    // Удаляем элемент из списка товаров/услуг по id товара
    e.preventDefault();

    let prepareToDeleteList = items_input;
    var index = items_input.findIndex(p => p.id === id_item)
    prepareToDeleteList.splice(index, 1)
    localStorage.setItem("items", JSON.stringify(prepareToDeleteList));
    window.dispatchEvent(new Event("storage"));
}

export default CartRemoveItem;