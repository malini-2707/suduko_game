import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Typography, 
  Container, 
  useMediaQuery,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Home as HomeIcon,
  PlayArrow as PlayIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';

// Import Pages
import HomePage from './pages/HomePage';
import Game from './components/Game';
import Login from './components/Login';
import Register from './components/Register';
import TutorialPage from './pages/TutorialPage';
import ProfilePage from './pages/ProfilePage';
import DailyChallengesPage from './pages/DailyChallengesPage';
import Leaderboard from './components/Leaderboard';
import UserList from './components/UserList';
import AboutPage from './pages/AboutPage';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function AppContent() {
  const { user, loading, logout } = useAuth();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
      >
        <Box className="spinner" sx={{ width: 50, height: 50, mb: 2 }} />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const navItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/' },
    { label: 'Play', icon: <PlayIcon />, path: '/game' },
    { label: 'Daily Challenge', icon: <CalendarIcon />, path: '/daily' },
    { label: 'Leaderboard', icon: <TrophyIcon />, path: '/leaderboard' },
    { label: 'Tutorial', icon: <PeopleIcon />, path: '/tutorial' },
    { label: 'About', icon: <PersonIcon />, path: '/about' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAuthPage && (
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper' }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="h6"
                  noWrap
                  component={RouterLink}
                  to="/"
                  sx={{
                    mr: 2,
                    display: 'flex',
                    fontWeight: 700,
                    letterSpacing: '.2rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    background: theme.palette.mode === 'dark' 
                      ? 'linear-gradient(45deg, #90caf9, #b39ddb)' 
                      : 'linear-gradient(45deg, #1976d2, #7b1fa2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  🧩 SUDOKU MASTER
                </Typography>
                
                {user && !isMobile && (
                  <Box sx={{ display: 'flex', ml: 4, gap: 1 }}>
                    {navItems.map((item) => (
                      <Button
                        key={item.label}
                        component={RouterLink}
                        to={item.path}
                        startIcon={item.icon}
                        sx={{
                          color: location.pathname === item.path 
                            ? theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2' 
                            : 'text.primary',
                          fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  onClick={colorMode.toggleColorMode} 
                  color="inherit"
                  aria-label="toggle theme"
                >
                  {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                
                {user ? (
                  <>
                    <Button
                      onClick={handleMenu}
                      color="inherit"
                      startIcon={
                        <Avatar 
                          alt={user.username} 
                          src={user.avatar} 
                          sx={{ width: 32, height: 32 }}
                        />
                      }
                      sx={{ textTransform: 'none', color: 'text.primary' }}
                    >
                      {!isMobile && (
                        <Box textAlign="left" sx={{ ml: 1 }}>
                          <Typography variant="subtitle2" lineHeight={1}>
                            {user.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.role === 'admin' ? 'Admin' : 'Player'}
                          </Typography>
                        </Box>
                      )}
                    </Button>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem 
                        component={RouterLink} 
                        to="/profile"
                        onClick={handleClose}
                      >
                        <ListItemIcon>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Profile</ListItemText>
                      </MenuItem>
                      {user.role === 'admin' && (
                        <MenuItem 
                          component={RouterLink} 
                          to="/users"
                          onClick={handleClose}
                        >
                          <ListItemIcon>
                            <PeopleIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Users</ListItemText>
                        </MenuItem>
                      )}
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button 
                      component={RouterLink} 
                      to="/login" 
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      Login
                    </Button>
                    <Button 
                      component={RouterLink} 
                      to="/register" 
                      color="primary" 
                      variant="contained"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Box>
            </Toolbar>
            
            {user && isMobile && (
              <Box sx={{ display: 'flex', overflowX: 'auto', pb: 1, px: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    startIcon={item.icon}
                    size="small"
                    sx={{
                      minWidth: 'auto',
                      px: 1.5,
                      color: location.pathname === item.path 
                        ? theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2' 
                        : 'text.primary',
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      '& .MuiButton-startIcon': {
                        margin: 0,
                        '& > *:nth-of-type(1)': {
                          fontSize: '1.25rem',
                        },
                      },
                    }}
                  >
                    {isMobile ? null : item.label}
                  </Button>
                ))}
              </Box>
            )}
          </Container>
        </AppBar>
      )}
      
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
        <Container maxWidth={isAuthPage ? 'sm' : 'xl'} sx={{ py: isAuthPage ? 4 : 2 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<Game />} />
            <Route path="/tutorial" element={<TutorialPage />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/daily" element={<DailyChallengesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/users" element={user && user.role === 'admin' ? <UserList /> : <Navigate to="/" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </Box>
      
      {!isAuthPage && (
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            px: 2, 
            mt: 'auto',
            backgroundColor: (theme) => 
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Sudoku Master. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
                <Button 
                  component="a" 
                  href="#" 
                  size="small" 
                  color="inherit"
                >
                  Terms
                </Button>
                <Button 
                  component="a" 
                  href="#" 
                  size="small" 
                  color="inherit"
                >
                  Privacy
                </Button>
                <Button 
                  component="a" 
                  href="#" 
                  size="small" 
                  color="inherit"
                >
                  Contact
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
}

function App() {
  const [mode, setMode] = React.useState('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
          },
          secondary: {
            main: mode === 'light' ? '#7b1fa2' : '#b39ddb',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
            fontSize: '3rem',
            lineHeight: 1.2,
          },
          h2: {
            fontWeight: 600,
            fontSize: '2.5rem',
          },
          h3: {
            fontWeight: 600,
            fontSize: '2rem',
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.75rem',
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.5rem',
          },
          h6: {
            fontWeight: 600,
            fontSize: '1.25rem',
          },
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 16px',
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px 0 rgba(0,0,0,0.1)',
                },
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
