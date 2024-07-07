/**
* Добавляет новую строку, если встречает символ ;
*/
const AddNewLine = (info) => {
    if (info !== null) {
        let new_line = info.replaceAll('; ','\n')
        return new_line
    }
}

export default AddNewLine;