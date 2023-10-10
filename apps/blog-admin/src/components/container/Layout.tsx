import { useEffect, useState } from 'react';
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
  Stack,
  Toolbar,
  Typography,
  theme,
  useMediaQuery
} from 'ui';
import { Article, Create, Folder, Menu } from 'ui-icon';

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
        elevation={0}
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
              <Typography color={theme.palette.primary.main} fontWeight={600}>
                chanoo-admin
              </Typography>
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
            <NavLink to="/write">
              {({ isActive }) => (
                <ListItem disablePadding>
                  <ListItemButton selected={isActive}>
                    <ListItemIcon>
                      <Create />
                    </ListItemIcon>
                    <ListItemText>Writing</ListItemText>
                  </ListItemButton>
                </ListItem>
              )}
            </NavLink>
            <NavLink to="/post">
              {({ isActive }) => (
                <ListItem disablePadding>
                  <ListItemButton selected={isActive}>
                    <ListItemIcon>
                      <Article />
                    </ListItemIcon>
                    <ListItemText>Post</ListItemText>
                  </ListItemButton>
                </ListItem>
              )}
            </NavLink>
          </List>
          <Divider />
          <List subheader={<ListSubheader>Storage</ListSubheader>}>
            <NavLink to="/folder">
              {({ isActive }) => (
                <ListItem disablePadding>
                  <ListItemButton selected={isActive}>
                    <ListItemIcon>
                      <Folder />
                    </ListItemIcon>
                    <ListItemText>Folder</ListItemText>
                  </ListItemButton>
                </ListItem>
              )}
            </NavLink>
          </List>
        </Stack>
      </Drawer>
      <Stack
        height="100%"
        // ml={!smallScreen && isOpenSidebar ? '300px' : '0px'}
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
        <Stack component="main" height="100%" minHeight={0} mt="64px" width="100%">
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
}
