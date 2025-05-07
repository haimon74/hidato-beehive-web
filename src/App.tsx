import React, { useState, useRef } from 'react';
import Board, { BoardRef } from './components/Board';
import GameControls from './components/GameControls';
import GameInstructions from './components/GameInstructions';
import GameStatus from './components/GameStatus';
import styles from './App.module.css';

const App: React.FC = () => {
  const [size, setSize] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showSolution, setShowSolution] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const boardRef = useRef<BoardRef>(null);

  const handleNewGame = () => {
    setShowSolution(false);
    setIsComplete(false);
    boardRef.current?.generateNewPuzzle();
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    handleNewGame();
  };

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    handleNewGame();
  };

  const handleToggleSolution = () => {
    setShowSolution(!showSolution);
  };

  const handleCompletion = () => {
    setIsComplete(true);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hidato Puzzle</h1>
      <GameControls
        size={size}
        difficulty={difficulty}
        onSizeChange={handleSizeChange}
        onDifficultyChange={handleDifficultyChange}
        onNewGame={handleNewGame}
        onToggleSolution={handleToggleSolution}
        showSolution={showSolution}
      />
      <Board
        ref={boardRef}
        size={size}
        difficulty={difficulty}
        showSolution={showSolution}
        onComplete={handleCompletion}
      />
      <GameStatus isComplete={isComplete} showSolution={showSolution} />
      <GameInstructions size={size} />
    </div>
  );
};

export default App;
