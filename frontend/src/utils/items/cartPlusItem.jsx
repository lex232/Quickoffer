const CartPlusItem = (results, items_input, e) => {
    // Добавляем элемент в список товаров/услуг
    e.preventDefault();

    let prepareToAddList = items_input;
    let title_temp = ''
    if (results.brand) {
        title_temp = results.title + ' ' + results.brand
    }
    else {
        title_temp = results.title
    }

    prepareToAddList.push({
        id: results.id,
        title: title_temp,
        item_price_retail: results.price_retail,
        item_price_purchase: results.price_retail,
        amount: "1",
        description: results.description,
        image: results.image
    })
    localStorage.setItem("items", JSON.stringify(prepareToAddList));
    window.dispatchEvent(new Event("storage"));
}

export default CartPlusItem;