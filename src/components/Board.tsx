import React, { memo, useCallback, useMemo, useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Cell from './Cell';
import { checkSolution, Grid, generateHexGrid, generateHexHamiltonianPath, maskHexGrid, getHexNeighbors } from './utils/hidatoUtils';
import styles from './Board.module.css';

interface BoardProps {
  size: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: () => void;
  showSolution: boolean;
}

export interface BoardRef {
  generateNewPuzzle: () => void;
}

const Board = forwardRef<BoardRef, BoardProps>(({
  size,
  difficulty,
  onComplete,
  showSolution,
}, ref) => {
  const [grid, setGrid] = useState<Grid>([]);
  const [solution, setSolution] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const boardRef = useRef<HTMLDivElement>(null);
  const N = useMemo(() => solution.flat().filter(cell => cell !== null).length, [solution]);
  const generateNewPuzzle = useCallback(() => {
    // 1. Generate the hex grid shape
    const emptyGrid = generateHexGrid(size);
    console.log("empty grid: ", emptyGrid);
    // 2. Generate a Hamiltonian path for the hex grid
    const solution = generateHexHamiltonianPath(emptyGrid);
    console.log("solution: ", solution);
    // 3. Count non-null cells
    const totalCells = solution.flat().filter(cell => cell !== null).length;
    // 4. Determine reveal count based on difficulty
    const revealPercent = {
      easy: 0.4,
      medium: 0.3,
      hard: 0.2,
    }[difficulty];
    const revealCount = Math.floor(totalCells * revealPercent);
    // 5. Mask the solution to create the puzzle
    const puzzle = maskHexGrid(solution, revealCount);
    setGrid(puzzle);
    setSolution(solution);
    setSelectedCell(null);
    setInputValue('');
  }, [size, difficulty]);

  useImperativeHandle(ref, () => ({
    generateNewPuzzle,
  }), [generateNewPuzzle]);

  useEffect(() => {
    // Use hexagonal grid for initial state
    setGrid(generateHexGrid(size));
    setSolution(generateHexGrid(size));
    setSelectedCell(null);
    setInputValue('');
  }, [size]);

  const checkCompletion = useCallback(() => {
    if (checkSolution(grid)) {
      onComplete();
    }
  }, [grid, onComplete]);

  const applyNumberToCell = useCallback((row: number, col: number, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > size * size) {
      return false;
    }

    const newGrid = grid.map(row => [...row]);
    newGrid[row][col] = numValue;
    setGrid(newGrid);
    return true;
  }, [grid, size]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (showSolution) return;

    if (selectedCell) {
      const [prevRow, prevCol] = selectedCell;
      if (prevRow === row && prevCol === col) {
        setSelectedCell(null);
        setInputValue('');
        return;
      }

      if (inputValue) {
        if (applyNumberToCell(prevRow, prevCol, inputValue)) {
          checkCompletion();
        }
      }
    }

    if (grid[row][col] === 0) {
      setSelectedCell([row, col]);
      setInputValue('');
    }
  }, [selectedCell, inputValue, grid, showSolution, applyNumberToCell, checkCompletion]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedCell) {
      const [row, col] = selectedCell;
      if (applyNumberToCell(row, col, inputValue)) {
        checkCompletion();
        setSelectedCell(null);
        setInputValue('');
      }
    } else if (e.key === 'Escape') {
      setSelectedCell(null);
      setInputValue('');
    } else if (e.key === 'Backspace') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (/^[0-9]$/.test(e.key)) {
      setInputValue(prev => {
        const newValue = prev + e.key;
        return newValue.length <= 2 ? newValue : prev;
      });
    }
  }, [selectedCell, inputValue, applyNumberToCell, checkCompletion]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boardRef.current && !boardRef.current.contains(event.target as Node)) {
        if (selectedCell && inputValue) {
          const [row, col] = selectedCell;
          if (applyNumberToCell(row, col, inputValue)) {
            checkCompletion();
          }
        }
        setSelectedCell(null);
        setInputValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedCell, inputValue, applyNumberToCell, checkCompletion]);

  const displayGrid = useMemo(() => showSolution ? solution : grid, [showSolution, solution, grid]);
  console.log(displayGrid);
  return (
    <div ref={boardRef} className={styles.container}>
      <svg
        width={size * 80}
        height={size * 80}
        style={{ display: 'block' }}
      >
        {displayGrid.map((row, rowIndex) => {
          // Find offset for this row
          const offset = row.findIndex(cell => cell !== null);
          // const rowVisibleCells = row.filter(cell => cell !== null && cell !== undefined);
          let paddingCount = 0;
          return row.map((cell, colIndex) => {
            if (cell === null || cell === undefined) {
              paddingCount++;
              return null;
            }
            // const colIndex = row.findIndex(c => c === cell);
            const hexWidth = 40;
            const hexHeight = Math.sqrt(3) / 2 * hexWidth;
            const x = (colIndex - paddingCount) * (6+(hexWidth * 0.75)) + offset * ((hexWidth * 0.75 / 2)+3) + 40;
            const y = rowIndex * ((hexWidth-4) * Math.sqrt(3) / 2) + 40;
            const isFirstOrLast = cell === 1 || cell === N;
            const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
            if (isSelected) {
              console.log("selected cell: ", selectedCell);
              console.log("colIndex: ", colIndex);
              console.log("row: ", row);
            }
            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={Number(cell)}
                isRevealed={row[colIndex] !== 0}
                isSelected={isSelected}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                inputValue={selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex ? inputValue : ''}
                onKeyPress={handleKeyPress}
                row={rowIndex}
                col={colIndex}
                isFirstOrLast={isFirstOrLast}
                x={x}
                y={y}
                hexWidth={hexWidth}
                hexHeight={hexHeight}
                rotate30={true}
              />
            );
          });
        })}
      </svg>
    </div>
  );
});

Board.displayName = 'Board';

export default memo(Board); 