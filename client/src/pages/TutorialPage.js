import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Card, 
  CardContent,
  Divider,
  Grid
} from '@mui/material';
import { styled } from '@mui/system';
import {
  LooksOne as LooksOneIcon,
  LooksTwo as LooksTwoIcon,
  Looks3 as Looks3Icon,
  Looks4 as Looks4Icon,
  Looks5 as Looks5Icon,
} from '@mui/icons-material';

const StyledStepIcon = styled(Box)(({ theme, active }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
  color: active ? '#fff' : theme.palette.text.primary,
  margin: '0 auto',
  fontWeight: 'bold',
}));

const steps = [
  {
    label: 'The Grid',
    description: 'A standard Sudoku puzzle consists of a 9x9 grid, divided into 3x3 subgrids called "regions".',
    icon: <LooksOneIcon />,
  },
  {
    label: 'The Numbers',
    description: 'The goal is to fill the grid with digits 1 through 9 so that each column, each row, and each of the nine 3x3 subgrids contain all of the digits from 1 to 9 without repeating.',
    icon: <LooksTwoIcon />,
  },
  {
    label: 'Starting Point',
    description: 'Some numbers are given at the start. These are called "givens" and cannot be changed.',
    icon: <Looks3Icon />,
  },
  {
    label: 'Rules',
    description: '1. Each row must contain the numbers 1-9 without repetition.\n2. Each column must contain the numbers 1-9 without repetition.\n3. Each 3x3 subgrid must contain the numbers 1-9 without repetition.',
    icon: <Looks4Icon />,
  },
  {
    label: 'Tips',
    description: 'Look for rows, columns, or subgrids that are nearly complete. Use the process of elimination to find the correct numbers for empty cells.',
    icon: <Looks5Icon />,
  },
];

const TutorialPage = () => {
  const [activeStep] = React.useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          How to Play Sudoku
        </Typography>
        <Typography variant="h6" color="textSecondary" align="center" paragraph sx={{ mb: 6 }}>
          Learn the rules and strategies to become a Sudoku master!
        </Typography>
      </motion.div>

      <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
        <Stepper alternativeLabel activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <StyledStepIcon active={active || completed}>
                    {index + 1}
                  </StyledStepIcon>
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: (theme) => theme.shadows[8],
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      color: 'primary.main'
                    }}>
                      {step.icon}
                      <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
                        {step.label}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      {step.description.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mt: 4,
        gap: 2
      }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/game"
        >
          Start Playing Now
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          component={Link}
          to="/"
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default TutorialPage;
