import React, { memo, useMemo } from 'react';
import styles from './GameStatus.module.css';

interface GameStatusProps {
  isComplete: boolean;
  showSolution: boolean;
}

const GameStatus: React.FC<GameStatusProps> = memo(({ isComplete, showSolution }) => {
  const getStatusMessage = useMemo(() => {
    if (isComplete) {
      return 'Congratulations! You solved the puzzle!';
    }
    if (showSolution) {
      return 'Solution is visible';
    }
    return 'Keep going!';
  }, [isComplete, showSolution]);

  let statusClass = styles.status;
  if (isComplete) statusClass += ` ${styles.complete}`;
  else if (showSolution) statusClass += ` ${styles.solution}`;

  return (
    <div className={statusClass}>
      {getStatusMessage}
    </div>
  );
});

GameStatus.displayName = 'GameStatus';

export default GameStatus; 