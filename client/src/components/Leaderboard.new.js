import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination, 
  Avatar, 
  Tabs, 
  Tab, 
  Chip, 
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  styled
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon, 
  Person as PersonIcon,
  FilterList as FilterIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';

const StyledTableRow = styled(TableRow)(({ theme, rank }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(rank === 1 && {
    '& td': {
      backgroundColor: theme.palette.warning.light,
      fontWeight: 'bold',
    },
  }),
  ...(rank === 2 && {
    '& td': {
      backgroundColor: theme.palette.grey[200],
      fontWeight: 'bold',
    },
  }),
  ...(rank === 3 && {
    '& td': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      fontWeight: 'bold',
    },
  }),
  '&.current-user': {
    '& td': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(25, 118, 210, 0.2)' 
        : 'rgba(25, 118, 210, 0.05)',
    },
  },
}));

const RankBadge = ({ rank }) => {
  const theme = useTheme();
  
  const getBadgeStyles = () => {
    switch(rank) {
      case 1:
        return {
          bgcolor: theme.palette.warning.main,
          color: theme.palette.warning.contrastText,
          content: '🥇',
        };
      case 2:
        return {
          bgcolor: theme.palette.grey[500],
          color: theme.palette.grey[100],
          content: '🥈',
        };
      case 3:
        return {
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          content: '🥉',
        };
      default:
        return {
          bgcolor: theme.palette.grey[200],
          color: theme.palette.text.primary,
          content: rank,
        };
    }
  };

  const styles = getBadgeStyles();
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        bgcolor: styles.bgcolor,
        color: styles.color,
        fontWeight: 'bold',
        fontSize: rank <= 3 ? '1.2rem' : '0.9rem',
      }}
    >
      {rank <= 3 ? styles.content : rank}
    </Box>
  );
};

const DifficultyChip = ({ difficulty }) => {
  const theme = useTheme();
  
  const getStyles = () => {
    switch(difficulty?.toLowerCase()) {
      case 'easy':
        return {
          bgcolor: theme.palette.success.light,
          color: theme.palette.success.dark,
          label: 'Easy'
        };
      case 'medium':
        return {
          bgcolor: theme.palette.warning.light,
          color: theme.palette.warning.dark,
          label: 'Medium'
        };
      case 'hard':
        return {
          bgcolor: theme.palette.error.light,
          color: theme.palette.error.dark,
          label: 'Hard'
        };
      default:
        return {
          bgcolor: theme.palette.grey[300],
          color: theme.palette.grey[800],
          label: 'All'
        };
    }
  };

  const styles = getStyles();
  
  return (
    <Chip 
      label={styles.label}
      size="small"
      sx={{
        bgcolor: styles.bgcolor,
        color: styles.color,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
};

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPlayers: 0,
    userRank: 0,
    userScore: 0,
    completionRate: 0,
  });

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedDifficulty, page, rowsPerPage]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      
      // In a real app, this would be an API call
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        rank: i + 1,
        username: `user${i + 1}`,
        score: 1000 - (i * 10) + Math.floor(Math.random() * 50),
        time: `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        completed: Math.random() > 0.1, // 90% completion rate
        isCurrentUser: user && `user${i + 1}` === user.username,
      }));
      
      setLeaderboard(mockData);
      setStats({
        totalPlayers: 1000,
        userRank: 42, // Mock rank
        userScore: 850, // Mock score
        completionRate: 75, // Mock completion rate
      });
      
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedDifficulty(newValue);
    setPage(0);
  };
  
  const refreshLeaderboard = () => {
    setPage(0);
    fetchLeaderboard();
  };

  if (loading && !leaderboard.length) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box 
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            mb: 4,
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              fontSize: '2.5rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            🏆
          </Box>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{
              fontWeight: 700,
              mb: 1,
              position: 'relative',
              zIndex: 1,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Leaderboard
          </Typography>
          <Typography 
            variant="h6" 
            sx={{
              opacity: 0.9,
              mb: 3,
              position: 'relative',
              zIndex: 1,
            }}
          >
            Compete with players worldwide
          </Typography>
          
          {/* Stats */}
          <Box 
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 3,
              mt: 3,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalPlayers.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Players
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.completionRate}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Completion Rate
              </Typography>
            </Box>
            
            {user && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  #{stats.userRank || '--'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Your Rank
                </Typography>
              </Box>
            )}
            
            {user && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stats.userScore.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Your Score
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Difficulty Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }} elevation={2}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}>
            <Tabs 
              value={selectedDifficulty}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': {
                  height: 4,
                  borderRadius: '4px 4px 0 0',
                },
              }}
            >
              <Tab 
                label="All" 
                value="all" 
                icon={<FilterIcon />} 
                iconPosition="start"
                sx={{ minHeight: 60 }}
              />
              <Tab 
                label="Easy" 
                value="easy" 
                icon={<DifficultyChip difficulty="easy" />} 
                iconPosition="start"
                sx={{ minHeight: 60 }}
              />
              <Tab 
                label="Medium" 
                value="medium" 
                icon={<DifficultyChip difficulty="medium" />} 
                iconPosition="start"
                sx={{ minHeight: 60 }}
              />
              <Tab 
                label="Hard" 
                value="hard" 
                icon={<DifficultyChip difficulty="hard" />} 
                iconPosition="start"
                sx={{ minHeight: 60 }}
              />
            </Tabs>
            
            <Tooltip title="Refresh leaderboard">
              <IconButton 
                onClick={refreshLeaderboard}
                color="primary"
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* Error Message */}
          {error && (
            <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
          
          {/* Leaderboard Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 80, fontWeight: 'bold' }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Player</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Score</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Time</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Difficulty</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : leaderboard.length > 0 ? (
                  leaderboard.map((entry) => (
                    <StyledTableRow 
                      key={entry.id} 
                      rank={entry.rank}
                      className={entry.isCurrentUser ? 'current-user' : ''}
                      hover
                    >
                      <TableCell>
                        <RankBadge rank={entry.rank} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: entry.isCurrentUser 
                                ? theme.palette.primary.main 
                                : theme.palette.grey[300],
                              width: 36,
                              height: 36,
                              fontSize: '0.9rem',
                              color: entry.isCurrentUser 
                                ? theme.palette.primary.contrastText 
                                : theme.palette.text.primary,
                            }}
                          >
                            {entry.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: entry.isCurrentUser ? 600 : 'normal',
                                color: entry.isCurrentUser 
                                  ? theme.palette.primary.main 
                                  : 'inherit',
                              }}
                            >
                              {entry.username}
                              {entry.isCurrentUser && ' (You)'}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Level {Math.floor(entry.score / 100) + 1}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight="bold">
                          {entry.score.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1">
                          {entry.time}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <DifficultyChip difficulty={entry.difficulty} />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2">
                            {new Date(entry.date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </Typography>
                        </Box>
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <TrophyIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="h6" color="textSecondary">
                          No records found
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Be the first to complete a puzzle in this category!
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={1000} // In a real app, this would come from the API
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-toolbar': {
                justifyContent: 'center',
              },
              '& .MuiTablePagination-actions': {
                ml: 2,
              },
            }}
          />
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Leaderboard;
