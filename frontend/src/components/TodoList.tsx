import { Stack, Typography, CircularProgress, Alert } from '@mui/material';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: Error | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList = ({ todos, loading, error, onToggle, onDelete }: TodoListProps) => {
  if (loading) {
    return (
      <Stack alignItems="center" spacing={2}>
        <CircularProgress />
        <Typography>로딩 중...</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error.message}
      </Alert>
    );
  }

  if (todos.length === 0) {
    return (
      <Alert severity="info">
        할 일이 없습니다. 새로운 할 일을 추가해보세요!
      </Alert>
    );
  }

  return (
    <Stack spacing={2}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
};
