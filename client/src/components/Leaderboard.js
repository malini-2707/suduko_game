import React, { useState, useEffect } from 'react';
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
  Refresh as RefreshIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Styled components
const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'isCurrentUser',
})(({ theme, iscurrentuser }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(iscurrentuser === 'true' && {
    '& td': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.action.selected,
    },
  }),
}));

const Leaderboard = () => {
  const { user } = useAuth();
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
    totalGames: 24,
    winRate: 87,
    bestTime: '3:42'
  });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          rank: i + 1,
          username: `user${i + 1}`,
          score: 1000 - (i * 10) + Math.floor(Math.random() * 50),
          time: `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
          date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
          isCurrentUser: user && `user${i + 1}` === user.username,
        }));
        
        setLeaderboard(mockData);
        setStats(prev => ({
          ...prev,
          totalPlayers: 1000,
          userRank: 42,
          userScore: 850,
          completionRate: 75
        }));
        
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [selectedDifficulty, page, rowsPerPage, user]);

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
  };

  const RankBadge = ({ rank }) => {
    const getBadgeStyles = () => {
      switch(rank) {
        case 1: return { bgcolor: 'gold', color: 'black', content: '1' };
        case 2: return { bgcolor: 'silver', color: 'black', content: '2' };
        case 3: return { bgcolor: '#cd7f32', color: 'white', content: '3' };
        default: return { bgcolor: 'grey.200', color: 'text.primary', content: rank };
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
        }}
      >
        {styles.content}
      </Box>
    );
  };

  const DifficultyChip = ({ difficulty }) => {
    const getStyles = () => {
      switch(difficulty?.toLowerCase()) {
        case 'easy': return { bgcolor: 'success.light', color: 'success.dark', label: 'Easy' };
        case 'medium': return { bgcolor: 'warning.light', color: 'warning.dark', label: 'Medium' };
        case 'hard': return { bgcolor: 'error.light', color: 'error.dark', label: 'Hard' };
        default: return { bgcolor: 'grey.300', color: 'grey.800', label: 'All' };
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
        }}
      />
    );
  };

  if (loading && !leaderboard.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Header */}
        <Box 
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: 4,
            p: 4,
            mb: 4,
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
            Leaderboard
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Compete with players worldwide
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, mt: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalPlayers.toLocaleString()}
              </Typography>
              <Typography variant="body2">Total Players</Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.completionRate}%
              </Typography>
              <Typography variant="body2">Completion Rate</Typography>
            </Box>
            
            {user && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  #{stats.userRank || '--'}
                </Typography>
                <Typography variant="body2">Your Rank</Typography>
              </Box>
            )}
            
            {user && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stats.userScore.toLocaleString()}
                </Typography>
                <Typography variant="body2">Your Score</Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* User Stats */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">Your Statistics</Typography>
            <Tooltip title="View your game history">
              <IconButton color="primary" size="small">
                <CalendarMonthIcon sx={{ mr: 0.5 }} />
                <Typography variant="body2">View History</Typography>
              </IconButton>
            </Tooltip>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography variant="body2" color="textSecondary">Total Games</Typography>
              <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 'bold' }}>{stats.totalGames}</Typography>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography variant="body2" color="textSecondary">Win Rate</Typography>
              <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 'bold' }}>{stats.winRate}%</Typography>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography variant="body2" color="textSecondary">Best Time</Typography>
              <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 'bold' }}>{stats.bestTime}</Typography>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography variant="body2" color="textSecondary">Total Score</Typography>
              <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 'bold' }}>{stats.userScore.toLocaleString()}</Typography>
            </Paper>
          </Box>
        </Box>

        {/* Leaderboard Table */}
        <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }} elevation={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Tabs 
              value={selectedDifficulty}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All" value="all" />
              <Tab label="Easy" value="easy" />
              <Tab label="Medium" value="medium" />
              <Tab label="Hard" value="hard" />
            </Tabs>
            
            <Tooltip title="Refresh leaderboard">
              <IconButton onClick={refreshLeaderboard} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {error && (
            <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
          
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
                      iscurrentuser={entry.isCurrentUser ? 'true' : 'false'}
                      hover
                    >
                      <TableCell>
                        <RankBadge rank={entry.rank} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: entry.isCurrentUser ? 'primary.main' : 'grey.300',
                              color: entry.isCurrentUser ? 'primary.contrastText' : 'text.primary',
                            }}
                          >
                            {entry.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: entry.isCurrentUser ? 600 : 'normal',
                                color: entry.isCurrentUser ? 'primary.main' : 'inherit',
                              }}
                            >
                              {entry.username}
                              {entry.isCurrentUser && ' (You)'}
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
                        {entry.time}
                      </TableCell>
                      <TableCell align="center">
                        <DifficultyChip difficulty={entry.difficulty} />
                      </TableCell>
                      <TableCell align="right">
                        {new Date(entry.date).toLocaleDateString()}
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
                        <Typography variant="body2" color="textSecondary">
                          Be the first to complete a puzzle in this category!
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={1000}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Leaderboard;
