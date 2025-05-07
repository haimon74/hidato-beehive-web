import React, { memo, useMemo } from 'react';
import styles from './GameControls.module.css';

interface GameControlsProps {
  size: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onSizeChange: (size: number) => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onNewGame: () => void;
  onToggleSolution: () => void;
  showSolution: boolean;
}

const GameControls: React.FC<GameControlsProps> = memo(({
  size,
  difficulty,
  onSizeChange,
  onDifficultyChange,
  onNewGame,
  onToggleSolution,
  showSolution,
}) => {
  
  const handleSizeChange = useMemo(() => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSizeChange(Number(e.target.value));
  }, [onSizeChange]);

  const handleDifficultyChange = useMemo(() => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard');
  }, [onDifficultyChange]);

  return (
    <div className={styles.controls}>
      <label>
        Grid Size:
        <select
          value={size}
          onChange={handleSizeChange}
          className={styles.select}
        >
          <option value={3}>Small (3, 19 cells)</option>
          <option value={4}>Medium (4, 37 cells)</option>
          <option value={5}>Large (5, 61 cells)</option>
          <option value={6}>Extra Large (6, 91 cells)</option>
        </select>
      </label>

      <label>
        Difficulty:
        <select
          value={difficulty}
          onChange={handleDifficultyChange}
          className={styles.select}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>

      <button onClick={onNewGame} className={styles.button}>
        New Game
      </button>

      <button
        onClick={onToggleSolution}
        className={`${styles.button} ${styles.toggleButton} ${showSolution ? styles.toggleButtonActive : ''}`}
      >
        {showSolution ? 'Hide Solution' : 'Show Solution'}
      </button>
    </div>
  );
});

GameControls.displayName = 'GameControls';

export default GameControls; 