/**
* Добавляет новую строку, если встречает символ ;
*/
const ReadCompanyType = (type) => {
    if (type==='ip') { return 'ИП' }
    else if (type==='ooo') { return 'ООО' }
    else if (type==='fiz') { return 'Физ. лицо' }
    else {return 'нет'}
  }

  export default ReadCompanyType;