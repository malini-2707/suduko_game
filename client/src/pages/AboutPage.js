import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const StyledAbout = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default,
  minHeight: 'calc(100vh - 64px)',
  display: 'flex',
  alignItems: 'center'
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const AboutPage = () => {
  const features = [
    {
      title: 'Daily Challenges',
      description: 'Test your skills with new puzzles every day and climb the leaderboard.'
    },
    {
      title: 'Multiple Difficulty Levels',
      description: 'From beginner to expert, find the perfect challenge for your skill level.'
    },
    {
      title: 'Learn & Improve',
      description: 'Access tutorials and tips to enhance your Sudoku solving techniques.'
    }
  ];

  return (
    <StyledAbout>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={8}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 4,
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              About Sudoku Master
            </Typography>
            
            <Typography 
              variant="h5" 
              color="textSecondary" 
              paragraph
              sx={{ maxWidth: '800px', mx: 'auto', mb: 6 }}
            >
              Welcome to the ultimate Sudoku experience. Our platform is designed to challenge and entertain puzzle enthusiasts of all levels.
            </Typography>
          </Box>

          <Box sx={{ mb: 12 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              align="center"
              sx={{ mb: 6 }}
            >
              Why Choose Sudoku Master?
            </Typography>
            
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                >
                  <FeatureCard elevation={3}>
                    <Typography variant="h6" component="h3" gutterBottom color="primary">
                      {feature.title}
                    </Typography>
                    <Typography color="textSecondary">
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              ))}
            </Box>
          </Box>

          <Box textAlign="center" sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Our Mission
            </Typography>
            <Typography 
              variant="body1" 
              color="textSecondary" 
              paragraph
              sx={{ mb: 4 }}
            >
              At Sudoku Master, we're dedicated to providing a premium Sudoku experience that challenges the mind and brings joy to puzzle lovers worldwide. 
              Our platform combines classic Sudoku gameplay with modern features to create an engaging and rewarding experience for players of all skill levels.
            </Typography>
            
            <Typography 
              variant="body1" 
              color="textSecondary"
              paragraph
            >
              Whether you're here to sharpen your skills, compete with friends, or simply enjoy some relaxing puzzle time, 
              we've got something for everyone. Join our community today and start your Sudoku journey!
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </StyledAbout>
  );
};

export default AboutPage;
