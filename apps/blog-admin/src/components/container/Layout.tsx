import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
  theme,
  useMediaQuery,
  useSnackbar
} from 'ui';
import { Article, Create, Folder, Menu } from 'ui-icon';
import { AlertContext } from './AlertContextProvider';

export function Layout() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (smallScreen) setIsOpenSidebar(false);
  }, [smallScreen]);

  return (
    <Stack height="100%" width="100%">
      <AppBar
        color="inherit"
        variant="outlined"
        sx={{
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <Stack alignItems="center" direction="row" spacing={2}>
            <IconButton
              aria-label="menu"
              size="large"
              onClick={() => setIsOpenSidebar((prev) => !prev)}
            >
              <Menu />
            </IconButton>
            <Link to="/">
              <Typography>chanoo-admin</Typography>
            </Link>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={isOpenSidebar}
        variant={smallScreen ? 'temporary' : 'persistent'}
        onClose={() => setIsOpenSidebar(false)}
      >
        <Stack width={300}>
          <Toolbar />
          <List subheader={<ListSubheader>Blog</ListSubheader>}>
            <NavLink to="/writing">
              {({ isActive }) => (
                <ListItem disablePadding>
                  <ListItemButton selected={isActive}>
                    <ListItemIcon>
                      <Create />
                    </ListItemIcon>
                    <ListItemText>writing</ListItemText>
                  </ListItemButton>
                </ListItem>
              )}
            </NavLink>
            <NavLink to="/write">
              {({ isActive }) => (
                <ListItem disablePadding>
                  <ListItemButton selected={isActive}>
                    <ListItemIcon>
                      <Article />
                    </ListItemIcon>
                    <ListItemText>writes</ListItemText>
                  </ListItemButton>
                </ListItem>
              )}
            </NavLink>
          </List>
          <Divider />
          <List subheader={<ListSubheader>Storage</ListSubheader>}>
            <NavLink to="/file">
              {({ isActive }) => (
                <ListItem disablePadding>
                  <ListItemButton selected={isActive}>
                    <ListItemIcon>
                      <Folder />
                    </ListItemIcon>
                    <ListItemText>file</ListItemText>
                  </ListItemButton>
                </ListItem>
              )}
            </NavLink>
          </List>
        </Stack>
      </Drawer>
      <Stack
        height="100%"
        ml={!smallScreen && isOpenSidebar ? '300px' : '0px'}
        width="100%"
        sx={{
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          }),
          ...(isOpenSidebar && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen
            })
          })
        }}
      >
        <Stack component="main" height="100$" minHeight={0} mt="64px" p={4} width="100%">
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
}
