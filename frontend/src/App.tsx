import { Container, Stack, Typography, Snackbar, Alert, Box } from '@mui/material';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { useTodos } from './hooks/useTodos';
import { useState } from 'react';

function App() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleAddTodo = async (title: string, description: string) => {
    try {
      await addTodo(title, description);
      setToast({
        open: true,
        message: '할 일이 추가되었습니다.',
        severity: 'success'
      });
    } catch (err) {
      setToast({
        open: true,
        message: '할 일을 추가하는데 실패했습니다.',
        severity: 'error'
      });
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      await toggleTodo(id);
      setToast({
        open: true,
        message: '할 일이 업데이트되었습니다.',
        severity: 'success'
      });
    } catch (err) {
      setToast({
        open: true,
        message: '할 일을 업데이트하는데 실패했습니다.',
        severity: 'error'
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setToast({
        open: true,
        message: '할 일이 삭제되었습니다.',
        severity: 'success'
      });
    } catch (err) {
      setToast({
        open: true,
        message: '할 일을 삭제하는데 실패했습니다.',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="sm">
        <Stack spacing={4}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              color: 'primary.main',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(33, 150, 243, 0.1)'
            }}
          >
            할 일 목록
          </Typography>
          <TodoForm onSubmit={handleAddTodo} />
          <TodoList
            todos={todos}
            loading={loading}
            error={error}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        </Stack>
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity={toast.severity} 
            onClose={() => setToast(prev => ({ ...prev, open: false }))}
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(33, 150, 243, 0.2)'
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App;
