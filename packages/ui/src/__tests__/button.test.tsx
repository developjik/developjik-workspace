import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';
import { describe, it, expect, vi } from 'vitest';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button appName="test">Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick with alert when clicked', () => {
    // Mock window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<Button appName="test">Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    
    expect(alertSpy).toHaveBeenCalledWith('Hello from your test app!');
    
    alertSpy.mockRestore();
  });

  it('applies custom className', () => {
    render(<Button appName="test" className="custom-class">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});