const getBase64 = (file, setFunc) => {
    // Переводим картинку в BASE64
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