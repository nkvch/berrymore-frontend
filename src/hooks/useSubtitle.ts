import { useLocation } from "react-router-dom"

const useSubtitle = () => {
  const location = useLocation();

  switch (location.pathname) {
    case '/':
      return 'Главная';
    case '/about':
      return 'О нас';
    case '/contacts':
      return 'Контакты';
    case '/signin':
      return 'Вход';
    case '/signup':
      return 'Регистрация';
    case '/foremen':
      return 'Бригадиры';
    case '/foremen/create':
      return 'Добавление бригадира';
    case '/stats':
      return 'Статистика';
    default:
      return '';
  }
}

export default useSubtitle;
