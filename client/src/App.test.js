import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loading text when no sockets connected', () => {
  render(<App />);
  const loadingText = screen.getByText('loading...');
  expect(loadingText).toBeInTheDocument();
});
