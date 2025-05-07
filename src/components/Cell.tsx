import React, { memo, useRef, useEffect } from 'react';

interface CellProps {
  value: number;
  isRevealed: boolean;
  isInitiallyRevealed: boolean;
  isSelected: boolean;
  onClick: () => void;
  inputValue: string;
  onKeyPress: (e: React.KeyboardEvent) => void;
  row?: number;
  col?: number;
  isFirstOrLast?: boolean;
  x?: number;
  y?: number;
  hexWidth?: number;
  hexHeight?: number;
  rotate30?: boolean;
}

const Cell: React.FC<CellProps> = memo(({
  value,
  isRevealed,
  isInitiallyRevealed,
  isSelected,
  onClick,
  inputValue,
  onKeyPress,
  row = 0,
  col = 0,
  isFirstOrLast = false,
  x = 0,
  y = 0,
  hexWidth = 40,
  hexHeight = Math.sqrt(3)* 40 / 2 ,
  rotate30 = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  // Calculate hexagon points
  const points = Array.from({ length: 6 }).map((_, i) => {
    const angle = Math.PI* i / 3 ;
    const px = x + hexWidth / 2 + (hexWidth* Math.cos(angle) / 2) ;
    const py = y + hexHeight / 2 + (hexWidth* Math.sin(angle) / 2) ;
    return `${px},${py}`;
  }).join(' ');

  let fill = '#fff';
  let stroke = '#333';
  if (isFirstOrLast) fill = '#ffd580';
  else if (isSelected) fill = '#bbdefb';
  else if (isRevealed) fill = '#e3f2fd';

  let textColor = '#222';
  if (isFirstOrLast) textColor = '#b26a00';
  else if (isRevealed) textColor = '#2196f3';

  const centerX = x + hexWidth / 2;
  const centerY = y + hexHeight / 2;

  const content = (
    <>
      <polygon points={points} fill={fill} stroke={stroke} strokeWidth={1} />
      {isSelected && !isInitiallyRevealed ? (
        <foreignObject
          x={x + hexWidth * 0.15}
          y={y + hexHeight * 0.15}
          width={hexWidth * 0.7}
          height={hexHeight * 0.7}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={inputValue}
            onChange={() => {}}
            onKeyDown={onKeyPress}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              textAlign: 'center',
              fontSize: '1.2rem',
              backgroundColor: 'transparent',
              outline: 'none',
              fontWeight: 'bold',
              color: '#2196f3',
              padding: 0,
              margin: 0,
              boxSizing: 'border-box',
              // ...(rotate30 ? { transform: `rotate(-30, ${centerX}, ${centerY})` } : {})
            }}
          />
        </foreignObject>
      ) : (
        <text
          x={x + hexWidth / 2}
          y={y + hexHeight / 2 + 6}
          textAnchor="middle"
          fontSize="1.2rem"
          fontWeight="bold"
          fill={textColor}
          pointerEvents="none"
          {...(rotate30 ? { transform: `rotate(-30, ${centerX}, ${centerY})` } : {})}
        >
          {value || ''}
        </text>
      )}
    </>
  );

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}
      {...(rotate30 ? { transform: `rotate(30, ${centerX}, ${centerY})` } : {})}
    >
      {content}
    </g>
  );
});

Cell.displayName = 'Cell';

export default Cell; 