import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';
import { Todo } from '../types/todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('할 일을 불러오는데 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (title: string, description: string) => {
    try {
      setLoading(true);
      const newTodo = {
        title,
        description,
        completed: false
      };
      await createTodo(newTodo);
      await fetchTodos();
    } catch (err) {
      throw err instanceof Error ? err : new Error('할 일을 추가하는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      setLoading(true);
      const todo = todos.find(t => t.id === id);
      if (todo) {
        const updates = {
          title: todo.title,
          description: todo.description,
          completed: !todo.completed
        };
        await updateTodo(id, updates);
        await fetchTodos();
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('할 일을 수정하는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const removeTodo = async (id: string) => {
    try {
      setLoading(true);
      await deleteTodo(id);
      await fetchTodos();
    } catch (err) {
      throw err instanceof Error ? err : new Error('할 일을 삭제하는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo: removeTodo
  };
};
