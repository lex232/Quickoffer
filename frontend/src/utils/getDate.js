/**
* Оставляет только дату при чтении DateTime из БД.
*/
const getDate = (datetime_in) => {
  if (datetime_in === null)
  return (
    ''
  );
  if (datetime_in === undefined)
  return (
    ''
  );
  else 
  return (
    datetime_in.slice(0, 10)
  );
};

export default getDate;
