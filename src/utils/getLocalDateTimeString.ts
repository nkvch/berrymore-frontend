const getLocalDateTimeString = (dateTime: Date, onlyDate?: boolean) => {
  const offset = dateTime.getTimezoneOffset() * 60 * 1000;
  const numberDatetime = Date.parse(dateTime.toString());

  const localDateTime = new Date(numberDatetime - offset);

  if (onlyDate) {
    return localDateTime.toISOString().slice(0, 10);
  }

  return localDateTime.toISOString().slice(0, -8);
};

export default getLocalDateTimeString;
