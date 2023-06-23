import { useMatch } from "react-router-dom";

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
  } else {
    return '';
  }
}

export default useSubtitle;
