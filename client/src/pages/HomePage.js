import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';

const StyledHero = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(6),
  boxShadow: theme.shadows[10],
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const HomePage = () => {
  const theme = useTheme();

  const features = [
    {
      icon: '🧩',
      title: 'Multiple Difficulty Levels',
      description: 'Choose from easy, medium, or hard puzzles to match your skill level.',
    },
    {
      icon: '🏆',
      title: 'Daily Challenges',
      description: 'Compete with others in daily unique puzzles and climb the leaderboard.',
    },
    {
      icon: '📊',
      title: 'Track Your Progress',
      description: 'Monitor your improvement with detailed statistics and achievements.',
    },
  ];

  return (
    <Box>
      <StyledHero>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h2" component="h1" gutterBottom>
                  Challenge Your Mind with Sudoku
                </Typography>
                <Typography variant="h6" paragraph>
                  Play the classic number puzzle game with a modern twist. Test your logic and problem-solving skills!
                </Typography>
                <Box mt={4}>
                  <Button
                    component={Link}
                    to="/game"
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
                  >
                    Play Now
                  </Button>
                  <Button
                    component={Link}
                    to="/tutorial"
                    variant="outlined"
                    color="inherit"
                    size="large"
                  >
                    Learn How to Play
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="https://brainbasket.co.in/cdn/shop/files/Sudoku_-8.jpg?v=1751373499&width=1946"
                  alt="Sudoku Preview"
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: theme.shadows[10],
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </StyledHero>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Why Play Our Sudoku?
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
          Experience the best Sudoku game with amazing features
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard elevation={3}>
                  <Typography variant="h2" align="center" gutterBottom>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h5" component="h3" align="center" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" align="center">
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box bgcolor="background.paper" py={8}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
              Ready to Play?
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph sx={{ mb: 4 }}>
              Join thousands of players enjoying Sudoku every day!
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
              size="large"
            >
              Get Started - It's Free!
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
