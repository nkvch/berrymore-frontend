const getJwtExpDate = (token: string): Date => {
  const jwtExp = JSON.parse(atob(token.split('.')[1])).exp;
  const dateNow = new Date();

  return new Date(dateNow.getTime() + jwtExp * 1000);
}

export default getJwtExpDate;
