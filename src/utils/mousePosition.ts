// Shared mutable mouse position tracked at document level
// This bypasses z-index stacking issues where content blocks canvas pointer events
export const mousePosition = {
  x: -1000,
  y: -1000,
  isOnScreen: false,
};
