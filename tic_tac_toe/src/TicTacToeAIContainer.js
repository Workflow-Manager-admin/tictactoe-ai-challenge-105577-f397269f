import React, { useState, useEffect } from 'react';
import BG_IMG from './assets/bg-screenshot.png';
// PUBLIC_INTERFACE
/**
 * Minimalist TicTacToe AI Challenge Main Container
 * Features: 3x3 grid, AI opponent, win/draw detection, restart & difficulty selector.
 * Color scheme: primary (#fff), secondary (#222), accent (#ee00ff).
 * Clean, centered layout.
 */

const COLORS = {
  primary: '#ffffff',
  secondary: '#222222',
  accent: '#ee00ff'
};

// CSS-in-JS styles for minimalist appearance, matching provided color/theme
const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    /* Minimalist, align center, dark overlay for readability */
    background: `
      linear-gradient(rgba(34,34,34,0.76), rgba(34,34,34,0.76)), 
      url(${BG_IMG}) center center / cover no-repeat
    `,
    color: COLORS.primary,
    flexDirection: 'column',
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif"
  },
  container: {
    background: 'rgba(34,34,34,0.97)',
    borderRadius: 18,
    padding: '38px 40px 30px 40px',
    boxShadow: `0 4px 40px rgba(60,60,60,0.17)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '360px'
  },
  gameBoard: {
    display: 'grid',
    gridTemplateRows: 'repeat(3, 68px)',
    gridTemplateColumns: 'repeat(3, 68px)',
    gap: '10px',
    margin: '18px 0'
  },
  cell: {
    width: '68px',
    height: '68px',
    background: COLORS.primary,
    color: COLORS.secondary,
    borderRadius: '8px',
    fontSize: '2.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    border: `2px solid ${COLORS.accent}`,
    fontWeight: 600,
    transition: 'background 0.1s'
  },
  indicator: {
    fontSize: '1.3rem',
    fontWeight: 500,
    marginBottom: 14,
    color: COLORS.primary
  },
  status: {
    minHeight: 28,
    fontSize: '1.08rem',
    fontWeight: 500,
    marginBottom: 16,
    marginTop: 6,
    color: COLORS.accent
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: 6
  },
  btn: {
    background: COLORS.accent,
    color: COLORS.primary,
    border: 'none',
    padding: '8px 20px',
    borderRadius: 5,
    fontSize: '1.07rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.13s',
    letterSpacing: '0.01em'
  },
  select: {
    fontSize: '1.04rem',
    padding: '6px 13px',
    margin: 0,
    borderRadius: 4,
    border: `1px solid ${COLORS.accent}`,
    background: COLORS.primary,
    color: COLORS.secondary,
    fontWeight: 500
  },
  label: {
    fontSize: '1.02rem',
    color: COLORS.primary,
    fontWeight: 400,
    marginRight: 8
  },
  header: {
    fontSize: '2.1rem',
    fontWeight: 700,
    color: COLORS.accent,
    marginBottom: 4,
    letterSpacing: '0.04em'
  }
};

// All 8 possible lines for win detection
const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]           // diags
];

// Difficulty AI strategies
const aiMove = (board, difficulty, aiSymbol, humanSymbol) => {
  switch (difficulty) {
    case 'Easy': // Random move
      return randomMove(board);
    case 'Medium': // Win/block, else random
      return mediumMove(board, aiSymbol, humanSymbol);
    case 'Hard': // MiniMax
      return miniMaxMove(board, aiSymbol, humanSymbol);
    default:
      return randomMove(board);
  }
};

function randomMove(board) {
  const empty = board.map((v, i) => v ? null : i).filter(i => i !== null);
  if (!empty.length) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

function mediumMove(board, aiSymbol, humanSymbol) {
  // 1. Win if possible
  for (let i=0; i<9; ++i) {
    if (!board[i]) {
      const copy = board.slice();
      copy[i] = aiSymbol;
      if (calculateWinner(copy)) return i;
    }
  }
  // 2. Block if opponent could win
  for (let i=0; i<9; ++i) {
    if (!board[i]) {
      const copy = board.slice();
      copy[i] = humanSymbol;
      if (calculateWinner(copy)) return i;
    }
  }
  // 3. Else random
  return randomMove(board);
}

function miniMaxMove(board, aiSymbol, humanSymbol) {
  // Use MiniMax (with limited depth for simplicity)
  function minimax(b, isMaximizing) {
    const winner = calculateWinner(b);
    if (winner === aiSymbol) return {score: 1};
    if (winner === humanSymbol) return {score: -1};
    if (!b.includes(null)) return {score: 0}; // Draw

    const moves = [];
    for (let i=0; i<9; ++i) {
      if (!b[i]) {
        const next = b.slice();
        next[i] = isMaximizing ? aiSymbol : humanSymbol;
        const result = minimax(next, !isMaximizing);
        moves.push({score: result.score, idx: i});
      }
    }
    // Pick best or worst depending on player
    if (isMaximizing) {
      let max = -Infinity, best;
      for (let m of moves) if (m.score > max) { max = m.score; best = m;}
      return best;
    } else {
      let min = Infinity, best;
      for (let m of moves) if (m.score < min) { min = m.score; best = m;}
      return best;
    }
  }
  const move = minimax(board, true);
  return move ? move.idx : randomMove(board);
}

/**
 * Returns X or O if there's a winner, or null otherwise
 * @param {Array} squares
 */
function calculateWinner(squares) {
  for (let line of WIN_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateDraw(squares) {
  return squares.every(v => v !== null) && !calculateWinner(squares);
}

/**
 * TicTacToeAIContainer React component
 */
// PUBLIC_INTERFACE
function TicTacToeAIContainer() {
  // X always starts, human is X
  const [board, setBoard] = useState(Array(9).fill(null)); // null | 'X' | 'O'
  const [isXNext, setIsXNext] = useState(true);
  const [gameStatus, setGameStatus] = useState({winner: null, draw: false});
  const [aiDifficulty, setAIDifficulty] = useState('Medium');

  // When board/isXNext changes, check win/draw and AI move
  useEffect(() => {
    const winner = calculateWinner(board);
    const draw = calculateDraw(board);
    setGameStatus({winner, draw});
    if (!winner && !draw && !isXNext) {
      // AI turn as 'O'
      const aiMoveIdx = aiMove(board, aiDifficulty, 'O', 'X');
      if (aiMoveIdx !== null) {
        setTimeout(() => {
          setBoard(b => {
            // Only play if still AI's turn and square is empty
            if (!b[aiMoveIdx] && !calculateWinner(b) && !calculateDraw(b)) {
              const newB = b.slice();
              newB[aiMoveIdx] = 'O';
              return newB;
            }
            return b;
          });
          setIsXNext(true);
        }, 310); // slight delay for realism
      }
    }
  // eslint-disable-next-line
  }, [board, isXNext, aiDifficulty]);

  // On player's click (only when game not over and player's turn)
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || gameStatus.winner || gameStatus.draw || !isXNext) return;
    const next = board.slice();
    next[idx] = 'X';
    setBoard(next);
    setIsXNext(false);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus({winner: null, draw: false});
  }

  // PUBLIC_INTERFACE
  function handleDifficultyChange(e) {
    setAIDifficulty(e.target.value);
    handleRestart();
  }

  // Turn indicator/status
  let indicator;
  if (gameStatus.winner) {
    indicator = `Winner: ${gameStatus.winner === 'X' ? "You" : "AI"} (${gameStatus.winner})`;
  } else if (gameStatus.draw) {
    indicator = "Draw!";
  } else {
    indicator = isXNext ? 'Your turn (X)' : "AI's turn (O)";
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        <div style={styles.header}>TicTacToe AI Challenge</div>

        <div style={{marginBottom: 8, marginTop: 2}}>
          <span style={styles.label}>Difficulty:&nbsp;
            <select value={aiDifficulty} style={styles.select} onChange={handleDifficultyChange}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </span>
        </div>

        <div style={styles.indicator}>
          { indicator }
        </div>

        <div style={styles.gameBoard}>
          {board.map((cell, idx) =>
            <div
              key={idx}
              style={{
                ...styles.cell,
                background: cell
                  ? (cell === 'X' ? '#fff' : '#faf7fd')
                  : COLORS.primary,
                color: cell === 'O' ? COLORS.accent : COLORS.secondary,
                opacity: (gameStatus.winner || gameStatus.draw) && !cell ? 0.48 : 1,
                cursor: (cell || gameStatus.winner || gameStatus.draw || !isXNext) ? 'not-allowed' : 'pointer',
                pointerEvents: (gameStatus.winner || gameStatus.draw || (!isXNext && !cell)) ? 'none' : 'auto'
              }}
              onClick={() => handleClick(idx)}
              tabIndex={0}
              aria-label={`cell ${idx+1} ${cell ? "with "+cell : "empty"}`}
              role="button"
              onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!cell) handleClick(idx)}}
            >
              {cell}
            </div>
          )}
        </div>

        <div style={styles.status}>
          { gameStatus.winner
            ? (gameStatus.winner === 'X'
                ? "Congratulations! You win 🎉"
                : "AI wins! Try again? 🤖")
            : (gameStatus.draw
                ? "Draw! Well played. 👏"
                : "") }
        </div>

        <div style={styles.controls}>
          <button style={styles.btn} onClick={handleRestart}>
            Restart
          </button>
        </div>

        <div style={{
          marginTop: 21,
          textAlign: 'center',
          fontSize: '0.98rem',
          color: '#aaa',
          opacity: 0.5,
          letterSpacing: '0.02em'
        }}>
          You: <span style={{color:COLORS.secondary,fontWeight:600}}>X</span> &mdash; AI: <span style={{color:COLORS.accent,fontWeight:600}}>O</span>
        </div>

      </div>
    </div>
  );
}

export default TicTacToeAIContainer;
