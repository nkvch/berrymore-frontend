import { ContactSupport, Logout } from '@mui/icons-material';
import {
  BottomNavigationAction,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemIcon,
  ListItemText
} from '@mui/material';
// import LogoutBtn from './components/LogoutBtn';
import { Helmet } from 'react-helmet';
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import useAuth from '../../api/auth/hooks/useAuth';
import useLogout from '../../api/auth/hooks/useLogout';
import useSubtitle from '../../hooks/useSubtitle';
import { isLoggedIn, isLoggedOut } from '../../recoil/authState';
import Logo from '../Logo/Logo';
import Notifications from '../Notifications/Notifications';
import { Block } from '../elements/Block';
import FlexContainer from '../elements/FlexContainer';
import { MenuItems } from './config';
import { AppBar, AppBarButton, BottomNavigation, BottomSideBarSection, ContactButtonText, Drawer, ListItemButton, LogButtonsContainer, LogoutBtn, Main, PageTitle, SideBar, SideBarLink, ToolBar } from './elements';
import mobileState from '../../recoil/mobileState';
import AddPortionButton from '../AddPortionButton/AddPortionButton';

const Wrapper = () => {
  useAuth();
  // const { user, logout, mode, setMode, ismobile } = useContext(Context);
  const navigate = useNavigate();

  const subTitle = useSubtitle();

  const loggedIn = useRecoilValue(isLoggedIn);
  const loggedout = useRecoilValue(isLoggedOut);

  const ismobile = useRecoilValue(mobileState);

  const logout = useLogout();

  const menuItems = MenuItems[loggedIn ? 'authenticated' : 'unauthenticated'];

  return (
    <>
      <Helmet>
        <title>Berrymore | {subTitle}</title>
      </Helmet>
      <AppBar
        className={loggedout ? 'loggedout' : 'loggedin'}
      >
        <ToolBar>
          <Logo subTitle={subTitle} />
          <FlexContainer>
            {!loggedIn && (
              <LogButtonsContainer>
                <AppBarButton onClick={() => navigate('/signin')}>
                  Войти
                </AppBarButton>
                <AppBarButton onClick={() => navigate('/signup')}>
                  Регистрация
                </AppBarButton>
              </LogButtonsContainer>
            )}
            {/* <AppBarButton
              size="large"
              onClick={() => navigate('/support/new-request')}
              title="Связаться с поддержкой"
            >
              <ContactSupport />
              <ContactButtonText>Связаться с поддержкой</ContactButtonText>
            </AppBarButton> */}
            {!loggedout && (
              <Button variant="text" onClick={logout}>
                Выйти
              </Button>
            )}
          </FlexContainer>
        </ToolBar>
      </AppBar>
      <Drawer className={loggedout ? 'loggedout' : 'loggedin'}>
        <SideBar>
          <Box>
            <Logo subTitle={subTitle} />
            <Divider />
            <List>
              {menuItems.map(({ text, Icon, linkUrl }) => (
                <ListItemButton key={text}>
                  <SideBarLink to={linkUrl}>
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </SideBarLink>
                </ListItemButton>
              ))}
            </List>
          </Box>
          <BottomSideBarSection>
            {/* <IconButton
              size="large"
              onClick={() => navigate('/support/new-request')}
              title="Связаться с поддержкой"
              style={{
                borderRadius: 4,
                fontSize: 14,
              }}
            >
              <ContactSupport />
              Связаться с поддержкой
            </IconButton> */}
            <Divider />
            {loggedIn && <LogoutBtn
              onClick={logout}
              endIcon={<Logout />}
            >
              Выйти
            </LogoutBtn>}
          </BottomSideBarSection>
        </SideBar>
      </Drawer>
      <Main
        className={loggedout ? 'loggedout' : 'loggedin'}
      >
        <Notifications />
        <Block>
          <PageTitle>
            {subTitle}
          </PageTitle>
          <Outlet />
        </Block>
      </Main>
      <AddPortionButton />
      <BottomNavigation value='TODO'>
        {menuItems.map(({ text, Icon, linkUrl }) => (
          <BottomNavigationAction
            key={text}
            label={text}
            icon={<Icon />}
            value={linkUrl}
            onClick={() => navigate(linkUrl)}
          />
        ))}
      </BottomNavigation>
    </>
  );
};

export default Wrapper;
