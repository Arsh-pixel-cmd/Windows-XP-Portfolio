// src/components/Minesweeper.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundEffects } from '../core/soundEffects';

type Difficulty = 'beginner' | 'intermediate' | 'expert';

interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}

const CONFIGS: Record<Difficulty, DifficultyConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#0000FF',
  2: '#008000',
  3: '#FF0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};

// 7-segment LED Display component
const LedDisplay: React.FC<{ value: number }> = ({ value }) => {
  const clamped = Math.max(-99, Math.min(999, value));
  const text = clamped < 0 
    ? `-${Math.abs(clamped).toString().padStart(2, '0')}`
    : clamped.toString().padStart(3, '0');

  return (
    <div className="bg-black px-1.5 py-0.5 border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white flex items-center justify-center">
      <span className="font-mono text-xl font-bold tracking-widest text-[#FF0000] select-none leading-none drop-shadow-[0_0_2px_#ff0000]">
        {text}
      </span>
    </div>
  );
};

export const Minesweeper: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [flagsLeft, setFlagsLeft] = useState<number>(CONFIGS.beginner.mines);
  const [seconds, setSeconds] = useState<number>(0);
  const [isCellMouseDown, setIsCellMouseDown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initBoard = useCallback((diff: Difficulty) => {
    const { rows, cols, mines } = CONFIGS[diff];
    const newGrid: Cell[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newGrid.push(row);
    }

    setGrid(newGrid);
    setGameStatus('idle');
    setFlagsLeft(mines);
    setSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    initBoard(difficulty);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty, initBoard]);

  // Start timer on first move
  useEffect(() => {
    if (gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setSeconds(s => Math.min(999, s + 1));
      }, 1000);
    } else if (gameStatus === 'won' || gameStatus === 'lost') {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  // Plant mines after first click so first move is always safe
  const plantMines = (initialR: number, initialC: number, board: Cell[][], totalMines: number) => {
    const rows = board.length;
    const cols = board[0].length;
    let placed = 0;

    while (placed < totalMines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      // Don't place on first clicked cell or its immediate neighbors
      if (Math.abs(r - initialR) <= 1 && Math.abs(c - initialC) <= 1) continue;
      if (!board[r][c].isMine) {
        board[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
              count++;
            }
          }
        }
        board[r][c].neighborMines = count;
      }
    }
  };

  // Reveal cell and cascade if 0
  const revealCell = (r: number, c: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    const currentGrid = grid.map(row => row.map(cell => ({ ...cell })));
    let currentStatus = gameStatus;

    if (currentStatus === 'idle') {
      plantMines(r, c, currentGrid, CONFIGS[difficulty].mines);
      currentStatus = 'playing';
      setGameStatus('playing');
    }

    const cell = currentGrid[r][c];
    if (cell.isFlagged || cell.isRevealed) return;

    soundEffects.playClick();

    // Hit a mine!
    if (cell.isMine) {
      soundEffects.playError();
      setGameStatus('lost');
      // Reveal all mines
      currentGrid.forEach(row => {
        row.forEach(cl => {
          if (cl.isMine) cl.isRevealed = true;
        });
      });
      setGrid(currentGrid);
      return;
    }

    // Cascade reveal algorithm
    const queue: [number, number][] = [[r, c]];
    cell.isRevealed = true;

    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      const curr = currentGrid[currR][currC];

      if (curr.neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (
              nr >= 0 &&
              nr < currentGrid.length &&
              nc >= 0 &&
              nc < currentGrid[0].length
            ) {
              const neighbor = currentGrid[nr][nc];
              if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                neighbor.isRevealed = true;
                if (neighbor.neighborMines === 0) {
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }
    }

    // Check win condition
    const { mines } = CONFIGS[difficulty];
    let unrevealedCount = 0;
    currentGrid.forEach(row => {
      row.forEach(cl => {
        if (!cl.isRevealed) unrevealedCount++;
      });
    });

    if (unrevealedCount === mines) {
      setGameStatus('won');
      soundEffects.playStartup();
      setFlagsLeft(0);
      currentGrid.forEach(row => {
        row.forEach(cl => {
          if (cl.isMine) cl.isFlagged = true;
        });
      });
    }

    setGrid(currentGrid);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    const currentGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const cell = currentGrid[r][c];
    if (cell.isRevealed) return;

    soundEffects.playClick();
    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagsLeft(f => f + 1);
    } else {
      if (flagsLeft > 0) {
        cell.isFlagged = true;
        setFlagsLeft(f => f - 1);
      }
    }

    setGrid(currentGrid);
  };

  const getSmileyFace = () => {
    if (gameStatus === 'lost') return '😵';
    if (gameStatus === 'won') return '😎';
    if (isCellMouseDown) return '😮';
    return '🙂';
  };

  return (
    <div className="h-full bg-[#C0C0C0] flex flex-col font-tahoma text-xs select-none p-1">
      {/* Menu Bar */}
      <div className="relative flex gap-3 text-gray-800 pb-1 mb-1 border-b border-[#808080]">
        <div className="relative">
          <span 
            onClick={() => setMenuOpen(!menuOpen)}
            className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-pointer rounded-sm"
          >
            Game
          </span>
          {menuOpen && (
            <div 
              className="absolute left-0 top-full mt-0.5 bg-[#ECE9D8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-md py-1 z-50 min-w-[130px]"
              onClick={() => setMenuOpen(false)}
            >
              <div 
                onClick={() => initBoard(difficulty)}
                className="px-3 py-1 hover:bg-[#316AC5] hover:text-white cursor-pointer"
              >
                New
              </div>
              <div className="h-[1px] bg-gray-400 my-1 mx-1" />
              <div 
                onClick={() => setDifficulty('beginner')}
                className={`px-3 py-1 hover:bg-[#316AC5] hover:text-white cursor-pointer flex items-center justify-between ${
                  difficulty === 'beginner' ? 'font-bold' : ''
                }`}
              >
                <span>Beginner</span>
                {difficulty === 'beginner' && <span>✓</span>}
              </div>
              <div 
                onClick={() => setDifficulty('intermediate')}
                className={`px-3 py-1 hover:bg-[#316AC5] hover:text-white cursor-pointer flex items-center justify-between ${
                  difficulty === 'intermediate' ? 'font-bold' : ''
                }`}
              >
                <span>Intermediate</span>
                {difficulty === 'intermediate' && <span>✓</span>}
              </div>
              <div 
                onClick={() => setDifficulty('expert')}
                className={`px-3 py-1 hover:bg-[#316AC5] hover:text-white cursor-pointer flex items-center justify-between ${
                  difficulty === 'expert' ? 'font-bold' : ''
                }`}
              >
                <span>Expert</span>
                {difficulty === 'expert' && <span>✓</span>}
              </div>
            </div>
          )}
        </div>
        <span 
          onClick={() => soundEffects.playBalloon()}
          className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-pointer rounded-sm"
        >
          Help
        </span>
      </div>

      {/* Main Game Container with Sunken Border */}
      <div 
        className="flex-1 flex flex-col items-center justify-start p-2.5 overflow-auto border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] bg-[#C0C0C0]"
        onClick={() => setMenuOpen(false)}
      >
        {/* Score & Smiley Header Box */}
        <div className="w-full max-w-fit px-3 py-2 bg-[#C0C0C0] border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white flex items-center justify-between mb-3 gap-6">
          <LedDisplay value={flagsLeft} />

          {/* Smiley Button */}
          <button
            onClick={() => initBoard(difficulty)}
            className="w-7 h-7 bg-[#C0C0C0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white flex items-center justify-center text-base focus:outline-none"
            title="Reset Game"
          >
            {getSmileyFace()}
          </button>

          <LedDisplay value={seconds} />
        </div>

        {/* Board Grid */}
        <div 
          className="border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white inline-block bg-[#808080]"
          onMouseDown={() => setIsCellMouseDown(true)}
          onMouseUp={() => setIsCellMouseDown(false)}
          onMouseLeave={() => setIsCellMouseDown(false)}
        >
          {grid.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => {
                let content = null;
                if (cell.isRevealed) {
                  if (cell.isMine) {
                    content = (
                      <span className="text-black font-bold text-xs select-none">
                        💣
                      </span>
                    );
                  } else if (cell.neighborMines > 0) {
                    content = (
                      <span
                        className="font-bold text-xs select-none font-mono"
                        style={{ color: NUMBER_COLORS[cell.neighborMines] }}
                      >
                        {cell.neighborMines}
                      </span>
                    );
                  }
                } else if (cell.isFlagged) {
                  content = (
                    <span className="text-red-600 font-bold text-xs select-none">
                      🚩
                    </span>
                  );
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => revealCell(r, c)}
                    onContextMenu={e => toggleFlag(e, r, c)}
                    disabled={gameStatus === 'won' || gameStatus === 'lost'}
                    className={`w-5 h-5 flex items-center justify-center font-bold text-xs focus:outline-none select-none transition-none ${
                      cell.isRevealed
                        ? cell.isMine && gameStatus === 'lost'
                          ? 'bg-red-500 border border-gray-500'
                          : 'bg-[#C0C0C0] border-[0.5px] border-[#808080]'
                        : 'bg-[#C0C0C0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white'
                    }`}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
