
import ItemSearch from '../../item-search';
import ClientsSearch from '../../clients-search';
import SimpleDivMessage from '../../messages';

import items_api from '../../../api/items_api';
import clients_api from '../../../api/clients_api';

import { ReactComponent as PlusIco } from '../../../static/image/icons/plus-square.svg'
  
  // Показывать ли div с результатами поиска?
  const [ showItems, setShowItems ] = useState(false)

  // Показывать ли div с ошибкой
  const [ showError, setShowError ] = useState(false)

    // Блок поиска для товаров
  // itemList - полученный список товаров из бэкенда (поиска API)
  const [ itemList, setItemList ] = useState()
  // itemValue - в процессе поиска используем title,
  // По завершению поиска - заполняем все поля
  const [ itemValue, setItemValue ] = useState({
    title: '',
    price_retail: 0,
    image: '',
    description: '',
    id: null
  })

  // UseEffect для динамического поиска товаров
  useEffect(_ => {
    if (itemValue.title === '') {
      return setItemList([])
    }
    setShowError(false)
    items_api
      .findItem({ item: itemValue.title })
      .then(inputitems => {
        setItemList(inputitems)
      })
  }, [itemValue.title])

const handleItemAutofill = ({ id, title, price_retail, image, description}) => {
    // Заполнение параметров товара при добавлении
    setItemValue({
      id,
      title,
      price_retail,
      image,
      description
    })
  }

  const CheckSameItem = (id_add) => {
    // Проверяем на одинаковый товар
    var index
    for (index = 0; index < list.length; ++index) {
      if (id_add === list[index].id) {
        setShowError(true)
        return false
      }
    }
    return true
  }


  const handlePlusItem = (e) => {
    // Добавляем элемент в список товаров/услуг
    e.preventDefault();

    let prepareToAddList = list;

    if (CheckSameItem(itemValue.id)) {
      console.log(itemValue)

      prepareToAddList.push({
        id: itemValue.id,
        title: itemValue.title,
        item_price_retail: itemValue.price_retail,
        item_price_purchase: itemValue.price_retail,
        amount: "1",
        description: itemValue.description ,
        image: itemValue.image,
        // position: list.length + 1,
      })
      setList(prepareToAddList);
      localStorage.setItem("items", JSON.stringify(list));

      setDragAndDrop({
        ...dragAndDrop,
        draggedFrom: null,
        draggedTo: null,
        isDragging: false
      });
      calculateFinalPrice()
    }
    window.dispatchEvent(new Event("storage"));
  }