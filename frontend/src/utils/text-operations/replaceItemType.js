/**
* Добавляет новую строку, если встречает символ ;
*/
const ReadItemType = (type) => {
    if (type==='service') { return 'услуга' }
    else if (type==='product') { return 'товар' }
    else {return 'нет'}
  }

  export default ReadItemType;