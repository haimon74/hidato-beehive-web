import { CSSProperties } from 'react';

export const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '20px',
  backgroundColor: '#f0f0f0',
};

export const titleStyle: CSSProperties = {
  color: '#2196f3',
  marginBottom: '20px',
};

export const boardContainerStyle: CSSProperties = {
  position: 'relative',
  margin: '20px 0',
};

export const boardStyle: CSSProperties = {
  display: 'grid',
  gap: '2px',
  backgroundColor: '#ccc',
  padding: '2px',
  borderRadius: '4px',
};

export const numberStyle: CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#2196f3',
};

export const revealedNumberStyle: CSSProperties = {
  ...numberStyle,
  color: '#1976d2',
};

export const solutionNumberStyle: CSSProperties = {
  ...numberStyle,
  color: '#f44336',
  opacity: 0.5,
}; 