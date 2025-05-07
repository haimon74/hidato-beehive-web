import React, { memo } from 'react';
import styles from './GameInstructions.module.css';

interface GameInstructionsProps {
  size: number;
}

const GameInstructions: React.FC<GameInstructionsProps> = memo(({ size }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>How to Play</h2>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          Fill in the empty cells with numbers from 1 to {size * size}
        </li>
        <li className={styles.listItem}>
          Numbers must be connected horizontally, vertically, or diagonally
        </li>
        <li className={styles.listItem}>
          Click on an empty cell to start entering a number
        </li>
        <li className={styles.listItem}>
          Type a number and click another cell or press Enter to confirm
        </li>
        <li className={styles.listItem}>
          Use the "Show Solution" button if you need help
        </li>
      </ul>
    </div>
  );
});

GameInstructions.displayName = 'GameInstructions';

export default GameInstructions; 