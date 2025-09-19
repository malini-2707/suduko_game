import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  CardActionArea,
  CardMedia,
  Chip,
  Divider,
  LinearProgress,
  Tabs,
  Tab,
  useTheme,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/system';
import {
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  People as PlayersIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const ChallengeCard = styled(Card)(({ theme, active }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s, box-shadow 0.3s',
  border: active ? `2px solid ${theme.palette.primary.main}` : 'none',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const DifficultyChip = styled(Chip)(({ difficulty, theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 1,
  fontWeight: 'bold',
  backgroundColor: 
    difficulty === 'Easy' ? theme.palette.success.main :
    difficulty === 'Medium' ? theme.palette.warning.main :
    theme.palette.error.main,
  color: '#fff',
}));

const DailyChallengesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Mock data for challenges
  useEffect(() => {
    // Simulate API call
    const fetchChallenges = () => {
      setLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        const mockChallenges = [
          {
            id: 1,
            date: new Date(),
            difficulty: 'Medium',
            title: 'Midweek Mindbender',
            description: 'A perfect puzzle to test your midweek skills',
            players: 1245,
            completed: true,
            time: '12:34',
            bestTime: '8:42',
            reward: 50,
            image: '/daily-challenge-1.jpg',
          },
          {
            id: 2,
            date: new Date(Date.now() + 86400000), // Tomorrow
            difficulty: 'Hard',
            title: 'Weekend Warrior',
            description: 'Challenge your skills with this weekend special',
            players: 0,
            completed: false,
            time: null,
            bestTime: '--:--',
            reward: 100,
            image: '/daily-challenge-2.jpg',
            locked: true,
          },
          {
            id: 3,
            date: new Date(Date.now() + 2 * 86400000), // Day after tomorrow
            difficulty: 'Easy',
            title: 'Sunday Relaxer',
            description: 'A gentle puzzle to wind down your week',
            players: 0,
            completed: false,
            time: null,
            bestTime: '--:--',
            reward: 75,
            image: '/daily-challenge-3.jpg',
            locked: true,
          },
        ];
        setChallenges(mockChallenges);
        setLoading(false);
      }, 1000);
    };

    fetchChallenges();

    // Set up countdown timer
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow - now;
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const today = new Date().toDateString();
  const todayChallenge = challenges.find(challenge => 
    challenge.date.toDateString() === today
  );

  const upcomingChallenges = challenges.filter(challenge => 
    challenge.date.toDateString() !== today
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Daily Challenges
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Test your skills with unique puzzles every day and compete with players worldwide!
          </Typography>
        </Box>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
          sx={{ 
            mb: 4,
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center',
            },
          }}
        >
          <Tab label="Today's Challenge" />
          <Tab label="Upcoming Challenges" />
          <Tab label="Leaderboard" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Box sx={{ 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText', 
              p: 3, 
              borderRadius: 2,
              mb: 4,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}>
              <Box>
                <Typography variant="h6" gutterBottom>Time Remaining</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TimeBox value={timeRemaining.hours} label="Hours" />
                  <TimeBox value={timeRemaining.minutes} label="Minutes" />
                  <TimeBox value={timeRemaining.seconds} label="Seconds" />
                </Box>
              </Box>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                component={Link}
                to="/game?mode=daily"
                sx={{ 
                  bgcolor: 'secondary.contrastText',
                  color: 'secondary.main',
                  '&:hover': {
                    bgcolor: 'secondary.light',
                    color: 'secondary.contrastText',
                  },
                }}
              >
                Play Today's Challenge
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading today's challenge...</Typography>
              </Box>
            ) : todayChallenge ? (
              <ChallengeCard 
                elevation={3} 
                sx={{ 
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  height: 'auto',
                }}
                active
              >
                <Box sx={{ 
                  width: isMobile ? '100%' : '40%',
                  height: isMobile ? 200 : 'auto',
                  position: 'relative',
                }}>
                  <CardMedia
                    component="img"
                    image={todayChallenge.image}
                    alt={todayChallenge.title}
                    sx={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <DifficultyChip 
                    label={todayChallenge.difficulty} 
                    difficulty={todayChallenge.difficulty}
                  />
                </Box>
                <Box sx={{ 
                  p: 4, 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        {formatDate(todayChallenge.date)}
                      </Typography>
                    </Box>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {todayChallenge.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {todayChallenge.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 3, mt: 3, flexWrap: 'wrap' }}>
                      <StatItem 
                        icon={<PeopleIcon />} 
                        label="Players" 
                        value={todayChallenge.players.toLocaleString()} 
                      />
                      <StatItem 
                        icon={<TimerIcon />} 
                        label="Best Time" 
                        value={todayChallenge.completed ? todayChallenge.time : '--:--'} 
                        highlight={todayChallenge.completed}
                      />
                      <StatItem 
                        icon={<StarIcon />} 
                        label="Reward" 
                        value={`${todayChallenge.reward} XP`} 
                      />
                    </Box>
                  </Box>
                  
                  {todayChallenge.completed ? (
                    <Box sx={{ 
                      mt: 3, 
                      p: 2, 
                      bgcolor: 'success.light', 
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      <CheckCircleIcon color="success" />
                      <Typography>You've completed today's challenge in {todayChallenge.time}!</Typography>
                    </Box>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      fullWidth
                      component={Link}
                      to="/game?mode=daily"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ mt: 3 }}
                    >
                      Start Challenge
                    </Button>
                  )}
                </Box>
              </ChallengeCard>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  No challenge available for today. Please check back later!
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Grid container spacing={3}>
            {upcomingChallenges.map((challenge, index) => (
              <Grid item xs={12} md={6} key={challenge.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ChallengeCard elevation={3}>
                    <CardActionArea disabled={challenge.locked}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={challenge.image}
                          alt={challenge.title}
                          sx={{ opacity: challenge.locked ? 0.7 : 1 }}
                        />
                        <DifficultyChip 
                          label={challenge.difficulty} 
                          difficulty={challenge.difficulty}
                        />
                        {challenge.locked && (
                          <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                          }}>
                            <LockIcon sx={{ fontSize: 40, mb: 1 }} />
                          </Box>
                        )}
                      </Box>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {formatDate(challenge.date)}
                        </Typography>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {challenge.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {challenge.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <StatItem 
                            icon={<StarIcon />} 
                            label="Reward" 
                            value={`${challenge.reward} XP`}
                            small
                          />
                          {challenge.locked ? (
                            <Chip 
                              icon={<LockIcon />} 
                              label="Coming Soon" 
                              variant="outlined" 
                              size="small"
                            />
                          ) : (
                            <Chip 
                              label="Available" 
                              color="primary" 
                              variant="outlined" 
                              size="small"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </ChallengeCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {tabValue === 2 && (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Daily Challenge Leaderboard</Typography>
            <Typography color="text.secondary" paragraph>
              Compete with players from around the world to get the best time on today's challenge!
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              py: 6,
              bgcolor: 'background.default',
              borderRadius: 2,
              my: 2,
            }}>
              <TrophyIcon sx={{ fontSize: 60, color: 'gold', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Complete today's challenge to see the leaderboard!
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 3 }}
                component={Link}
                to="/game?mode=daily"
              >
                Play Now
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontStyle: 'italic' }}>
              Note: Leaderboard updates in real-time. Your position will be visible after completing the challenge.
            </Typography>
          </Paper>
        )}
      </motion.div>
    </Container>
  );
};

const TimeBox = ({ value, label }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Box sx={{
      bgcolor: 'rgba(255,255,255,0.2)',
      color: 'white',
      p: 1,
      minWidth: 60,
      borderRadius: 1,
      fontWeight: 'bold',
      fontSize: '1.5rem',
    }}>
      {value.toString().padStart(2, '0')}
    </Box>
    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
      {label}
    </Typography>
  </Box>
);

const StatItem = ({ icon, label, value, small = false, highlight = false }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
      <Box sx={{ mr: 0.5, display: 'flex' }}>{icon}</Box>
      <Typography variant={small ? 'caption' : 'body2'}>{label}</Typography>
    </Box>
    <Typography 
      variant={small ? 'body2' : 'body1'} 
      fontWeight="bold"
      color={highlight ? 'primary' : 'text.primary'}
    >
      {value}
    </Typography>
  </Box>
);

export default DailyChallengesPage;
