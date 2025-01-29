import { Todo } from '../types/todo';

const API_URL = 'https://cwxhc8o84b.execute-api.ap-northeast-2.amazonaws.com/prod';

// Todo 목록 조회
export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) {
    throw new Error('할 일 목록을 가져오는데 실패했습니다.');
  }
  return response.json();
};

// Todo 생성
export const createTodo = async (todo: { title: string; description: string; completed: boolean }): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error('할 일을 생성하는데 실패했습니다.');
  }
  return response.json();
};

// Todo 수정
export const updateTodo = async (id: string, updates: { completed: boolean }): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('할 일을 업데이트하는데 실패했습니다.');
  }
  return response.json();
};

// Todo 삭제
export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('할 일을 삭제하는데 실패했습니다.');
  }
};
