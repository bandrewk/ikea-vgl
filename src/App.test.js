import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Preisvergleich heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Preisvergleich/i);
  expect(headingElement).toBeInTheDocument();
});
