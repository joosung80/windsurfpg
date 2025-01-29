import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../TodoList';

describe('TodoList', () => {
  const mockTodos = [
    { id: '1', text: '첫 번째 할 일', completed: false },
    { id: '2', text: '두 번째 할 일', completed: true },
  ];
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnDelete.mockClear();
  });

  it('renders list of todos', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('첫 번째 할 일')).toBeInTheDocument();
    expect(screen.getByText('두 번째 할 일')).toBeInTheDocument();
  });

  it('renders empty message when no todos', () => {
    render(
      <TodoList
        todos={[]}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('할 일이 없습니다.')).toBeInTheDocument();
  });

  it('renders correct number of TodoItem components', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const todoItems = screen.getAllByRole('listitem');
    expect(todoItems).toHaveLength(2);
  });
});

import { Todo } from '../../types';

const mockTodos: Todo[] = [
  {
    id: '1',
    title: '테스트 할 일',
    description: '테스트 설명',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

const mockUpdateTodo = jest.fn();
const mockDeleteTodo = jest.fn();

describe('TodoList 컴포넌트', () => {
  it('할 일 목록을 렌더링합니다', () => {
    render(
      <TodoList
        todos={mockTodos}
        onUpdateTodo={mockUpdateTodo}
        onDeleteTodo={mockDeleteTodo}
      />
    );

    expect(screen.getByText('테스트 할 일')).toBeInTheDocument();
    expect(screen.getByText('테스트 설명')).toBeInTheDocument();
  });

  it('할 일 완료 상태를 토글합니다', () => {
    render(
      <TodoList
        todos={mockTodos}
        onUpdateTodo={mockUpdateTodo}
        onDeleteTodo={mockDeleteTodo}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockUpdateTodo).toHaveBeenCalledWith({
      ...mockTodos[0],
      completed: true
    });
  });

  it('할 일을 삭제합니다', () => {
    render(
      <TodoList
        todos={mockTodos}
        onUpdateTodo={mockUpdateTodo}
        onDeleteTodo={mockDeleteTodo}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /삭제/i });
    fireEvent.click(deleteButton);

    expect(mockDeleteTodo).toHaveBeenCalledWith(mockTodos[0].id);
  });
});
