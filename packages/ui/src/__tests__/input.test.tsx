import { render, screen } from '@testing-library/react';
import { Input } from '../input';
import { describe, it, expect } from 'vitest';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows helper text when no error', () => {
    render(<Input helperText="Enter your name" />);
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
  });

  it('prioritizes error over helper text', () => {
    render(
      <Input 
        error="This field is required" 
        helperText="Enter your name" 
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.queryByText('Enter your name')).not.toBeInTheDocument();
  });
});