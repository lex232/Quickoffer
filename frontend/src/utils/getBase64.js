/**
* Переводит картинку в base64.
*/
const getBase64 = (file, setFunc) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        setFunc(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
  }

  export default getBase64;