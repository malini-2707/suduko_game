import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Game = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [currentBoard, setCurrentBoard] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [errors, setErrors] = useState(new Set());
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  
  const { user } = useAuth();

  // Timer effect
  useEffect(() => {
    let interval;
    if (startTime && !gameComplete) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateNewGame = async () => {
    setLoading(true);
    setGameComplete(false);
    setErrors(new Set());
    setSelectedCell(null);
    setSelectedNumber(null);
    setMistakes(0);
    
    try {
      const response = await axios.get(`/api/sudoku/generate/${difficulty}`);
      const { puzzle: newPuzzle, solution: newSolution } = response.data;
      
      setPuzzle(newPuzzle);
      setSolution(newSolution);
      setCurrentBoard(newPuzzle.map(row => [...row]));
      setStartTime(Date.now());
      setTimeSpent(0);
    } catch (error) {
      console.error('Failed to generate puzzle:', error);
    }
    
    setLoading(false);
  };

  const isValidMove = (board, row, col, num) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (x !== col && board[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
      if (x !== row && board[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = i + startRow;
        const currentCol = j + startCol;
        if ((currentRow !== row || currentCol !== col) && 
            board[currentRow][currentCol] === num) {
          return false;
        }
      }
    }
    
    return true;
  };

  const handleCellChange = (row, col, value) => {
    if (puzzle[row][col] !== 0) return; // Can't change prefilled cells
    
    const num = parseInt(value) || 0;
    const newBoard = [...currentBoard];
    newBoard[row][col] = num;
    setCurrentBoard(newBoard);
    
    // Update errors
    const newErrors = new Set(errors);
    const cellKey = `${row}-${col}`;
    
    if (num !== 0 && !isValidMove(newBoard, row, col, num)) {
      newErrors.add(cellKey);
    } else {
      newErrors.delete(cellKey);
    }
    
    setErrors(newErrors);
    
    // Check if game is complete
    if (isBoardComplete(newBoard) && newErrors.size === 0) {
      setGameComplete(true);
      saveCompletedGame(newBoard);
    }
  };

  const isBoardComplete = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) return false;
      }
    }
    return true;
  };

  const saveCompletedGame = async (completedBoard) => {
    try {
      await axios.post('/api/game/complete', {
        puzzle,
        solution: completedBoard,
        difficulty,
        timeSpent
      });
    } catch (error) {
      console.error('Failed to save completed game:', error);
    }
  };

  const handleKeyPress = useCallback((e) => {
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    if (puzzle[row][col] !== 0) return;
    
    if (e.key >= '1' && e.key <= '9') {
      handleCellChange(row, col, e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleCellChange(row, col, '0');
    }
  }, [selectedCell, puzzle]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    generateNewGame();
  }, [difficulty]);

  const getCellClassName = (row, col) => {
    let className = 'sudoku-cell';
    
    if (puzzle[row][col] !== 0) {
      className += ' prefilled';
    }
    
    if (errors.has(`${row}-${col}`)) {
      className += ' error';
    }
    
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      className += ' selected';
    }
    
    return className;
  };

  const handleNumberPadClick = (number) => {
    setSelectedNumber(number);
    if (selectedCell) {
      const [row, col] = selectedCell;
      handleCellChange(row, col, number.toString());
    }
  };

  const handleCellClick = (row, col) => {
    setSelectedCell([row, col]);
    if (selectedNumber && puzzle[row][col] === 0) {
      handleCellChange(row, col, selectedNumber.toString());
    }
  };

  if (gameComplete) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px'}}>
        <div className="card" style={{textAlign: 'center', padding: '40px', background: 'linear-gradient(135deg, #d4edda, #c3e6cb)', borderRadius: '15px', margin: '20px 0'}}>
          <h2 style={{color: '#155724', marginBottom: '15px'}}>🎉 Congratulations!</h2>
          <p style={{color: '#155724', fontSize: '18px'}}>You completed the {difficulty} puzzle in {formatTime(timeSpent)}!</p>
          <button onClick={generateNewGame} className="btn" style={{marginTop: '20px'}}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-layout">
      <div className="game-board-section">
        {loading ? (
          <div style={{textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666'}}>Generating puzzle...</div>
        ) : (
          <div className="sudoku-board">
            {currentBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClassName(rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell === 0 ? '' : cell}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="game-controls-section">
        <div className="game-stats-header">
          <div className="mistakes-counter">
            Mistakes<br />
            {mistakes}/3
          </div>
          <div className="time-display">
            Time<br />
            {formatTime(timeSpent)} ⏸️
          </div>
        </div>

        <div className="control-buttons">
          <button className="control-btn">↶</button>
          <button className="control-btn">🔗</button>
          <button className="control-btn">✏️</button>
          <button className="control-btn">💡</button>
        </div>

        <div className="number-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
            <button
              key={number}
              className={`number-btn ${selectedNumber === number ? 'selected' : ''}`}
              onClick={() => handleNumberPadClick(number)}
            >
              {number}
            </button>
          ))}
        </div>

        <button onClick={generateNewGame} className="new-game-btn" disabled={loading}>
          {loading ? 'Generating...' : 'New Game'}
        </button>

        <div style={{marginTop: '20px'}}>
          <label style={{fontSize: '14px', color: '#718096'}}>Difficulty: </label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={loading}
            style={{padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '14px'}}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Game;
