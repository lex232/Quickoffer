const getDateAndTime = (datetime_in) => {
  if (datetime_in !== null)
  return (
    datetime_in.slice(0, 10) + ' ' + datetime_in.slice(11, 19)
  );
  else 
  return (
    ''
  );
};

export default getDateAndTime;
