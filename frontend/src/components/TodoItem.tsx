import {
  Box,
  Typography,
  Stack,
  Button,
  Checkbox,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <Paper elevation={1}>
      <Box p={2}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Checkbox
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              color="primary"
            />
            <Stack spacing={0.5}>
              <Typography
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.disabled' : 'text.primary'
                }}
              >
                {todo.title}
              </Typography>
              {todo.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none'
                  }}
                >
                  {todo.description}
                </Typography>
              )}
            </Stack>
          </Stack>
          <Button
            color="error"
            variant="text"
            size="small"
            onClick={() => onDelete(todo.id)}
            startIcon={<DeleteIcon />}
          >
            삭제
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};
