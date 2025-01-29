import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoForm from '../TodoForm';

describe('TodoForm', () => {
  const mockAddTodo = jest.fn();

  beforeEach(() => {
    mockAddTodo.mockClear();
  });

  it('renders input field and submit button', () => {
    render(<TodoForm onAdd={mockAddTodo} />);
    
    expect(screen.getByPlaceholderText('할 일을 입력하세요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가' })).toBeInTheDocument();
  });

  it('calls onAdd when form is submitted with valid input', () => {
    render(<TodoForm onAdd={mockAddTodo} />);
    
    const input = screen.getByPlaceholderText('할 일을 입력하세요');
    const button = screen.getByRole('button', { name: '추가' });

    fireEvent.change(input, { target: { value: '새로운 할 일' } });
    fireEvent.click(button);

    expect(mockAddTodo).toHaveBeenCalledWith('새로운 할 일');
    expect(input).toHaveValue('');
  });

  it('does not call onAdd when input is empty', () => {
    render(<TodoForm onAdd={mockAddTodo} />);
    
    const button = screen.getByRole('button', { name: '추가' });
    fireEvent.click(button);

    expect(mockAddTodo).not.toHaveBeenCalled();
  });
});
