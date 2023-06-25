import { useMatch } from "react-router-dom";
import useQueryParams from "./useQueryParams";

const useSubtitle = () => {
  const isHome = useMatch('/');
  const isSignin = useMatch('/signin');
  const isSignup = useMatch('/signup');
  const isStats = useMatch('/stats');
  const isForemen = useMatch('/foremen');
  const isCreateForeman = useMatch('/foremen/create');
  const isForeman = useMatch('/foremen/:id');
  const isCreateEmployee = useMatch('/employees/create');
  const isEmployees = useMatch('/employees');
  const isShifts = useMatch('/shifts');
  const isShift = useMatch('/shifts/day');
  const isProducts = useMatch('/products');
  const isCreateProduct = useMatch('/products/create');
  const isProduct = useMatch('/products/:id');
  const queryParams = useQueryParams();
  let date = queryParams.get('date');

  if (date)
    date = new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  if (isHome) {
    return 'Главная';
  } else if (isSignin) {
    return 'Вход';
  } else if (isSignup) {
    return 'Регистрация';
  } else if (isStats) {
    return 'Статистика';
  } else if (isForemen) {
    return 'Бригадиры';
  } else if (isForeman) {
    return 'Редактирование бригадира';
  } else if (isCreateForeman) {
    return 'Новый бригадир';
  } else if (isCreateEmployee) {
    return 'Новый сборщик';
  } else if (isEmployees) {
    return 'Сборщики';
  } else if (isShifts) {
    return 'Смены';
  } else if (isShift) {
    return `Смена ${date}`;
  } else if (isProducts) {
    return 'Продукты';
  } else if (isCreateProduct) {
    return 'Новый продукт';
  } else if (isProduct) {
    return 'Редактирование продукта';
  } else {
    return '';
  }
}

export default useSubtitle;
