import { Todo } from '../types/todo';

export const mockTodos: Todo[] = [
  {
    id: '1',
    title: '리액트 컴포넌트 설계',
    description: 'Todo 앱의 주요 컴포넌트 구조 설계 및 구현',
    completed: true,
    createdAt: '2025-01-29T10:00:00Z',
    updatedAt: '2025-01-29T10:30:00Z'
  },
  {
    id: '2',
    title: '상태 관리 구현',
    description: 'Todo 항목들의 상태 관리 로직 구현',
    completed: false,
    createdAt: '2025-01-29T11:00:00Z',
    updatedAt: '2025-01-29T11:00:00Z'
  },
  {
    id: '3',
    title: 'UI/UX 개선',
    description: '사용자 경험 향상을 위한 UI 개선 작업',
    completed: false,
    createdAt: '2025-01-29T12:00:00Z',
    updatedAt: '2025-01-29T12:00:00Z'
  }
];
