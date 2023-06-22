import styled from '@emotion/styled';
import MaterialAppBar from '@mui/material/AppBar';
import ToolBarMaterial from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import withDefaultProps from '../../helpers/withDefaultProps';
import FlexContainer from '../elements/FlexContainer';
import FlexContainerColumn from '../elements/FlexContainerColumn';
import ListItemButtonMaterial from '@mui/material/ListItemButton';
import BottomNavigationMaterial from '@mui/material/BottomNavigation';
import DrawerMaterial from '@mui/material/Drawer';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const AppBar = styled(withDefaultProps({ position: 'static' }, MaterialAppBar))`
  box-shadow: none;
  color: inherit;
  @media screen and (min-width: 769px) {
    &.loggedin {
      display: none !important;
    }
  }
`;

export const ToolBar = styled(ToolBarMaterial)`
  background-color: rgb(165, 209, 235);
  justify-content: space-between;
`;

export const AppBarButton = styled(IconButton)`
  border-radius: 4px;
  font-size: 16px;
`;

export const ContactButtonText = styled(withDefaultProps({ variant: 'body1' }, Typography))`
  @media screen and (max-width: 768px) {
    display: none !important;
  }
`;

export const SideBar = styled(FlexContainerColumn)`
  width: 220px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ListItemButton = styled(ListItemButtonMaterial)`
  padding: 0;
`;

export const BottomSideBarSection = styled(Box)`
  margin-bottom: 10px;
`;

export const Main = styled.main`
  /* display: flex; */
  padding: 20px 20px 20px 20px;
  min-height: calc(100vh - 64px);
  /* flex-direction: column;
  justify-content: center;
  align-items: center; */
  background-color: rgb(165, 209, 235);
  padding-bottom: 20px;
  @media screen and (max-width: 768px) {
    min-height: calc(100vh - 56px - 56px);
    margin-bottom: 56px;
    padding: 15px 15px 15px 15px;
  }
  @media screen and (min-width: 769px) {
    &.loggedin {
      margin-left: 220px;
      min-height: 100vh;
    }
  }
`;

export const BottomNavigation = styled(BottomNavigationMaterial)`
  position: fixed;
  bottom: 0;
  width: 100%;
  @media screen and (min-width: 769px) {
    display: none !important;
  }
`;

export const LogButtonsContainer = styled(FlexContainer)`
  display: flex;
  gap: 10px;
  @media screen and (max-width: 768px) {
    display: none !important;
  }
`;

export const Drawer = styled(withDefaultProps({ anchor: 'left', variant: 'permanent' }, DrawerMaterial))`
 &.loggedout {
    display: none;
  }
  @media screen and (max-width: 768px) {
    display: none !important;
  }
`;

export const SideBarLink = styled(Link)`
  display: flex;
  padding: 8px 16px;
  width: 100%;
`;

export const PageTitle = styled(withDefaultProps({ variant: 'h4' }, Typography))`
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
`;

export const LogoutBtn = styled(withDefaultProps({ color: 'inherit', variant: 'text' }, Button))`
  padding: 10px;
  width: 100%;
`;
