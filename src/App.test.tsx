// import React from 'react';  // No need for this in React 17+
import { render } from '@testing-library/react';
import App from './App';
import { test, expect } from 'vitest';  // Ensure vitest is imported

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});
