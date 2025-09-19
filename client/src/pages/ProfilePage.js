import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Avatar, 
  Tabs, 
  Tab, 
  Card, 
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  TextField
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Person as PersonIcon,
  EmojiEvents as TrophiesIcon,
  BarChart as StatsIcon,
  History as HistoryIcon,
  Star as StarIcon,
  CheckCircle as AchievementIcon,
  Timer as TimerIcon,
  TrendingUp as ProgressIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: '0 auto',
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[3],
}));

const StatCard = ({ icon, title, value, color = 'primary' }) => (
  <Card elevation={3} sx={{ height: '100%' }}>
    <CardContent sx={{ textAlign: 'center', py: 3 }}>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: `${color}.light`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: `${color}.contrastText`,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const AchievementItem = ({ title, description, achieved, icon }) => (
  <ListItem 
    sx={{ 
      bgcolor: achieved ? 'action.hover' : 'background.paper',
      borderRadius: 1,
      mb: 1,
      opacity: achieved ? 1 : 0.6,
    }}
  >
    <ListItemIcon>
      {achieved ? (
        <AchievementIcon color="primary" />
      ) : (
        <AchievementIcon color="disabled" />
      )}
    </ListItemIcon>
    <ListItemText 
      primary={title}
      secondary={description}
      primaryTypographyProps={{
        color: achieved ? 'primary' : 'text.primary',
        fontWeight: achieved ? 'bold' : 'normal',
      }}
    />
    {achieved && (
      <Chip 
        label="Earned" 
        color="success" 
        size="small" 
        variant="outlined"
      />
    )}
  </ListItem>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateWinRate = () => {
    if (!user?.stats?.gamesPlayed) return 0;
    return Math.round((user.stats.gamesCompleted / user.stats.gamesPlayed) * 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSaveProfile = async () => {
    try {
      // In a real app, you would make an API call to update the user's profile
      // await axios.put('/api/users/profile', formData);
      
      // For now, just toggle edit mode
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please log in to view your profile
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Log In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <StyledAvatar
                src={user.avatar || '/default-avatar.png'}
                alt={user.username}
                sx={{ mb: 2, width: 120, height: 120, mx: 'auto' }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </StyledAvatar>
              {editMode ? (
                <Box sx={{ textAlign: 'left', width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    margin="normal"
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveProfile}
                      fullWidth
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={toggleEditMode}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Typography variant="h5" component="h1" gutterBottom>
                    {user.username}
                  </Typography>
                  <Typography color="textSecondary" paragraph>
                    {user.bio || 'No bio provided'}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={toggleEditMode}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
              <Button 
                variant="outlined" 
                color="error" 
                fullWidth 
                onClick={() => navigate('/logout')}
              >
                Logout
              </Button>
            </Box>
            </Paper>

            {/* Stats Overview */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <StatsIcon color="primary" sx={{ mr: 1 }} />
                Stats Overview
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StatCard
                    icon={<TrophiesIcon />}
                    title="Games Played"
                    value={user.stats?.gamesPlayed || 0}
                    color="success"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    icon={<StarIcon />}
                    title="Win Rate"
                    value={`${calculateWinRate()}%`}
                    color="info"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    icon={<TimerIcon />}
                    title="Best Time"
                    value={formatTime(user.stats?.bestTime?.easy)}
                    color="warning"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    icon={<ProgressIcon />}
                    title="Total Play Time"
                    value={user.stats?.totalPlayTime ? `${Math.round(user.stats.totalPlayTime / 60)}h` : '0h'}
                    color="error"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{ mb: 3 }}
              >
                <Tab label="Profile" icon={<PersonIcon />} />
                <Tab label="Achievements" icon={<AchievementIcon />} />
                <Tab label="Game History" icon={<HistoryIcon />} />
              </Tabs>

              <Divider sx={{ mb: 3 }} />

              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">Username</Typography>
                      <Typography>{user.username}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                      <Typography>{user.email || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">Member Since</Typography>
                      <Typography>{new Date(user.createdAt).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">Bio</Typography>
                      <Typography>{user.bio || 'No bio provided'}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Your Achievements</Typography>
                  <List>
                    {user.achievements?.map((achievement, index) => (
                      <AchievementItem 
                        key={index}
                        title={achievement.title}
                        description={achievement.description}
                        achieved={achievement.achieved}
                      />
                    )) || (
                      <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                        No achievements yet. Keep playing to earn achievements!
                      </Typography>
                    )}
                  </List>
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Game History</Typography>
                  <List>
                    {user.gameHistory?.map((game, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${game.difficulty} - ${game.completed ? 'Completed' : 'Incomplete'}`}
                          secondary={`Time: ${formatTime(game.time)} • ${new Date(game.date).toLocaleDateString()}`}
                        />
                        {game.completed && (
                          <Chip 
                            label="Completed" 
                            color="success" 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </ListItem>
                    )) || (
                      <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                        No game history yet. Start playing to track your progress!
                      </Typography>
                    )}
                  </List>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  };

export default ProfilePage;
