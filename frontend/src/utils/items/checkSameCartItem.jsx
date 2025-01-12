const CheckSameCartItem = (id_item, items_input) => {
    /**
    * Проверяем на одинаковый товар
    */
    var index
    for (index = 0; index < items_input.length; ++index) {
        if (id_item === items_input[index].id) {
            return true
        }
    }
    return false
}

export default CheckSameCartItem;