/**
* Добавляет новую строку, если встречает символ ;
*/
const AddNewLine = (info) => {
    if (info !== null) {
        let new_line = info.replaceAll('; ','\n')
        console.log(new_line)
        return new_line
    }
}

export default AddNewLine;