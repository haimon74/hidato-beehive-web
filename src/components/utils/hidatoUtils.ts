// Directions for 8 neighbors in a square grid
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

// Directions for 6 neighbors in a flat-topped hex grid
const HEX_DIRECTIONS = [
  [0, -1], [1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0]
];

export type Position = [number, number];
export type Grid = (number | null)[][];

export const isValidPosition = (x: number, y: number, size: number): boolean => {
  return x >= 0 && x < size && y >= 0 && y < size;
};

export const getNeighbors = (x: number, y: number, grid: Grid): Position[] => {
  const size = grid.length;
  return DIRECTIONS
    .map(([dx, dy]) => [x + dx, y + dy] as Position)
    .filter(([nx, ny]) => isValidPosition(nx, ny, size) && grid[ny][nx] === 0);
};

export const warnsdorffSort = (x: number, y: number, grid: Grid): Position[] => {
  const neighbors = getNeighbors(x, y, grid);
  return neighbors.sort((a, b) => {
    const aNeighbors = getNeighbors(a[0], a[1], grid).length;
    const bNeighbors = getNeighbors(b[0], b[1], grid).length;
    return aNeighbors - bNeighbors;
  });
};

/**
 * Generate a Hamiltonian path using Warnsdorff's heuristic.
 * If it fails to fill the grid, retries until success.
 */
export const generateWarnsdorffPath = (size: number): Grid => {
  const maxTries = 1000;
  for (let attempt = 0; attempt < maxTries; attempt++) {
    const grid: Grid = Array(size).fill(0).map(() => Array(size).fill(0));
    const maxNumber = size * size;

    let x = Math.floor(Math.random() * size);
    let y = Math.floor(Math.random() * size);
    grid[y][x] = 1;

    let failed = false;

    for (let num = 2; num <= maxNumber; num++) {
      const neighbors: [number, number][] = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < size && ny >= 0 && ny < size && grid[ny][nx] === 0) {
            neighbors.push([nx, ny]);
          }
        }
      }

      if (neighbors.length === 0) {
        failed = true;
        break;
      }

      neighbors.sort((a, b) => {
        const onwardA = countUnvisitedNeighbors(grid, a[0], a[1]);
        const onwardB = countUnvisitedNeighbors(grid, b[0], b[1]);
        return onwardA - onwardB;
      });

      const [nx, ny] = neighbors[0];
      grid[ny][nx] = num;
      x = nx;
      y = ny;

      if (num === maxNumber) {
        return grid;
      }
    }
    if (!failed) break;
  }
  throw new Error("Failed to generate Hamiltonian path with Warnsdorff's heuristic after many tries.");
};

// Helper: count unvisited neighbors for Warnsdorff's heuristic
function countUnvisitedNeighbors(grid: Grid, x: number, y: number): number {
  const size = grid.length;
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < size && ny >= 0 && ny < size && grid[ny][nx] === 0) {
        count++;
      }
    }
  }
  return count;
}

// export const maskGrid = (solution: Grid, revealCount: number): Grid => {
//   const size = solution.length;
//   const puzzle: Grid = Array(size).fill(0).map(() => Array(size).fill(0));
//   const positions: [number, number][] = [];
//   let firstPos: [number, number] | null = null;
//   let lastPos: [number, number] | null = null;
//   const N = solution.flat().filter(cell => cell !== null).length;
//   console.log(N);
//   // Find positions of 1 and N
//   for (let i = 0; i < size; i++) {
//     for (let j = 0; j < size; j++) {
//       if (solution[i][j] === 1) firstPos = [i, j];
//       if (solution[i][j] === N) lastPos = [i, j];
//       positions.push([i, j]);
//     }
//   }

//   // Remove 1 and N from random reveal candidates
//   const filteredPositions = positions.filter(
//     ([i, j]) =>
//       !(firstPos && i === firstPos[0] && j === firstPos[1]) &&
//       !(lastPos && i === lastPos[0] && j === lastPos[1])
//   );

//   // Shuffle filtered positions
//   for (let i = filteredPositions.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [filteredPositions[i], filteredPositions[j]] = [filteredPositions[j], filteredPositions[i]];
//   }

//   // Always reveal 1 and N
//   if (firstPos) puzzle[firstPos[0]][firstPos[1]] = 1;
//   if (lastPos) puzzle[lastPos[0]][lastPos[1]] = N;

//   // Reveal the rest
//   for (let i = 0; i < revealCount; i++) {
//     const [y, x] = filteredPositions[i];
//     puzzle[y][x] = solution[y][x];
//   }

//   return puzzle;
// };

export const findNumber = (grid: Grid, target: number): Position | null => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] === target) {
        return [i, j];
      }
    }
  }
  return null;
};

export const getValidMoves = (x: number, y: number, grid: Grid, visited: Set<string>): Position[] => {
  const size = grid.length;
  const moves: Position[] = [];
  
  DIRECTIONS.forEach(([dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;
    if (isValidPosition(nx, ny, size)) {
      const key = `${nx},${ny}`;
      if ((grid[nx][ny] === 0 || typeof grid[nx][ny] === 'number') && !visited.has(key)) {
        moves.push([nx, ny]);
      }
    }
  });
  
  return moves;
};

export const countSolutions = (
  grid: Grid,
  currentNum: number = 1,
  visited: Set<string> = new Set(),
  solutions: number[] = [0]
): void => {
  const size = grid.length;
  const totalCells = size * size;

  const pos = findNumber(grid, currentNum);
  if (!pos) return;

  if (currentNum === totalCells) {
    solutions[0]++;
    return;
  }

  const [x, y] = pos;
  visited.add(`${x},${y}`);

  const nextVal = currentNum + 1;
  const nextPos = findNumber(grid, nextVal);

  if (nextPos) {
    if (getValidMoves(x, y, grid, visited).some(([nx, ny]) => nx === nextPos[0] && ny === nextPos[1])) {
      countSolutions(grid, nextVal, new Set(visited), solutions);
    }
  } else {
    getValidMoves(x, y, grid, visited).forEach(([nx, ny]) => {
      if (grid[nx][ny] === 0) {
        grid[nx][ny] = nextVal;
        countSolutions(grid, nextVal, new Set(visited), solutions);
        grid[nx][ny] = 0;
      }
    });
  }
};

export const hasUniqueSolution = (puzzle: Grid): boolean => {
  const solutions = [0];
  countSolutions([...puzzle.map(row => [...row])], 1, new Set(), solutions);
  return solutions[0] === 1;
};

export interface PuzzleResult {
  puzzle: Grid;
  solution: Grid;
}

// export const generatePuzzle = (size: number, difficulty: 'easy' | 'medium' | 'hard'): PuzzleResult => {
//   // Generate a complete solution using Warnsdorff's heuristic
//   const solution = generateWarnsdorffPath(size);

//   // Determine number of revealed cells based on difficulty
//   const revealCount = {
//     easy: Math.floor(size * size * 0.4),
//     medium: Math.floor(size * size * 0.3),
//     hard: Math.floor(size * size * 0.2),
//   }[difficulty];

//   // Create the puzzle by masking the solution
//   const puzzle = maskGrid(solution, revealCount);

//   return { puzzle, solution };
// };

export const checkSolution = (grid: Grid): boolean => {
  // Check if all cells are filled
  const isComplete = grid.every(row => 
    row.every(cell => cell === null || cell !== 0)
  );

  if (!isComplete) return false;

  // Verify the solution
  const size = grid.length;
  const maxNumber = size * size;
  const numbers = new Set<number>();

  // Check if all numbers from 1 to maxNumber are present
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = grid[i][j];
      if (value === null) continue;
      if (value < 1 || value > maxNumber || numbers.has(value)) {
        return false;
      }
      numbers.add(value);
    }
  }

  // Check if numbers are connected
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const currentValue = grid[i][j];
      if (currentValue === null) continue;
      if (currentValue === maxNumber) continue;

      const nextValue = currentValue + 1;
      let found = false;

      // Check all 8 adjacent cells
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;

          const ni = i + di;
          const nj = j + dj;

          if (ni >= 0 && ni < size && nj >= 0 && nj < size) {
            const neighbor = grid[ni][nj];
            if (neighbor === null) continue;
            if (neighbor === nextValue) {
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }

      if (!found) return false;
    }
  }

  return true;
};

export const getValidNeighbors = (x: number, y: number, size: number, grid: Grid): [number, number][] => {
  const neighbors: [number, number][] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;

      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < size && ny >= 0 && ny < size && grid[ny][nx] === 0) {
        neighbors.push([nx, ny]);
      }
    }
  }
  return neighbors;
};

export const findPreviousNumber = (grid: Grid, number: number): [number, number] | undefined => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === number - 1) {
        return [j, i];
      }
    }
  }
  return undefined;
};


// Generate a Hamiltonian path for a hex grid (Warnsdorff/backtracking)
export function generateHexHamiltonianPath(grid: Grid): Grid {
  // Find all valid cells
  const cells: Position[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== null) cells.push([x, y]);
    }
  }
  const total = cells.length;
  // Start from a random valid cell
  const [startX, startY] = cells[Math.floor(Math.random() * cells.length)];
  const pathGrid: Grid = grid.map(row => row.map(cell => (cell === null ? null : 0)));
  let found = false;

  function dfs(x: number, y: number, num: number): boolean {
    pathGrid[y][x] = num;
    if (num === total) return true;
    // Warnsdorff: sort neighbors by onward moves
    const neighbors = getHexNeighbors(x, y, pathGrid)
      .filter(([nx, ny]) => pathGrid[ny][nx] === 0)
      .sort((a, b) =>
        getHexNeighbors(a[0], a[1], pathGrid).filter(([qx, qy]) => pathGrid[qy][qx] === 0).length -
        getHexNeighbors(b[0], b[1], pathGrid).filter(([qx, qy]) => pathGrid[qy][qx] === 0).length
      );
    for (const [nx, ny] of neighbors) {
      if (dfs(nx, ny, num + 1)) return true;
    }
    pathGrid[y][x] = 0;
    return false;
  }

  found = dfs(startX, startY, 1);
  if (!found) throw new Error('Failed to generate Hamiltonian path for hex grid');
  return pathGrid;
}

// Mask/unmask cells for the puzzle, only for non-null cells
export function maskHexGrid(solution: Grid, revealCount: number): Grid {
  const positions: Position[] = [];
  for (let y = 0; y < solution.length; y++) {
    for (let x = 0; x < solution[y].length; x++) {
      if (solution[y][x] !== null) positions.push([x, y]);
    }
  }
  // Always reveal 1 and max
  const max = Math.max(...positions.map(([x, y]) => solution[y][x] as number));
  const puzzle: Grid = solution.map(row => row.map(cell => (cell === null ? null : 0)));
  let firstPos: Position | null = null;
  let lastPos: Position | null = null;
  for (const [x, y] of positions) {
    if (solution[y][x] === 1) firstPos = [x, y];
    if (solution[y][x] === max) lastPos = [x, y];
  }
  console.log(max);
  // Remove 1 and max from reveal candidates
  const filtered = positions.filter(([x, y]) =>
    !(firstPos && x === firstPos[0] && y === firstPos[1]) &&
    !(lastPos && x === lastPos[0] && y === lastPos[1])
  );
  // Shuffle
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }
  // Reveal 1 and max
  if (firstPos) puzzle[firstPos[1]][firstPos[0]] = 1;
  if (lastPos) puzzle[lastPos[1]][lastPos[0]] = max;
  // Reveal the rest
  for (let i = 0; i < revealCount && i < filtered.length; i++) {
    const [x, y] = filtered[i];
    puzzle[y][x] = solution[y][x];
  }
  return puzzle;
}

// Helper to generate a beehive hexagonal grid of side length n
export function generateHexGrid(n: number): (number | null)[][] {
  const grid: (number | null)[][] = [];
  const totalRows = 2 * n - 1;
  let value = 1;
  for (let row = 0; row < totalRows; row++) {
    // Number of non-null cells in this row
    const nonNulls = n + (row < n ? row : totalRows - 1 - row);
    // Padding on each side
    const pad = totalRows - nonNulls;
    const arr: (number | null)[] = [];
    // Left padding
    for (let i = 0; i < pad; i++) arr.push(null);
    // Alternate null and value
    for (let i = 0; i < nonNulls; i++) {
      arr.push(value++);
      arr.push(null);
    }
    // Right padding
    for (let i = 0; i < pad; i++) arr.push(null);
    grid.push(arr);
  }
  // Now replace all numbers with 0 (empty), keep nulls
  return grid.map(row => row.map(cell => (cell === null ? null : 0)));
}

// Beehive neighbor offsets
const BEEHIVE_NEIGHBOR_OFFSETS = [
  [-1, -1], [-1, 1], [1, -1], [1, 1], [0, -2], [0, 2]
];

// Get valid beehive hex neighbors for a cell
export function getHexNeighbors(x: number, y: number, grid: Grid): Position[] {
  const neighbors: Position[] = [];
  for (const [dy, dx] of BEEHIVE_NEIGHBOR_OFFSETS) {
    const ny = y + dy;
    const nx = x + dx;
    if (
      ny >= 0 && ny < grid.length &&
      nx >= 0 && nx < grid[ny].length &&
      grid[ny][nx] !== null
    ) {
      neighbors.push([nx, ny]);
    }
  }
  return neighbors;
} 