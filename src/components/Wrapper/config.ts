import PeopleIcon from '@mui/icons-material/People';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import History from '@mui/icons-material/History';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export const MenuItems = {
  authenticated: [{
    text: 'Сборщики',
    linkUrl: '/employees',
    Icon: PeopleIcon,
  }, {
    text: 'Продукты',
    linkUrl: '/products',
    Icon: ManageSearchIcon,
  }, {
    text: 'Бригадиры',
    linkUrl: '/foremen',
    Icon: SupervisorAccountIcon,
  }, {
    text: 'Статистика',
    linkUrl: '/stats',
    Icon: EqualizerIcon,
  }, {
    text: 'История',
    linkUrl: '/history',
    Icon: History,
  }],
  unauthenticated: [{
    text: 'Войти',
    linkUrl: '/signin',
    Icon: ExitToAppIcon,
  }, {
    text: 'Регистрация',
    linkUrl: '/signup',
    Icon: PersonAddIcon,
  }],
}
