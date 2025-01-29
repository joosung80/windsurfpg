import {
  Box,
  TextField,
  Button,
  Stack,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

interface TodoFormProps {
  onSubmit: (title: string, description: string) => void;
}

export const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} width="100%">
      <Stack spacing={2}>
        <Stack>
          <Typography fontWeight="medium">할 일</Typography>
          <TextField
            placeholder="할 일을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            size="small"
          />
        </Stack>
        <Stack>
          <Typography fontWeight="medium">상세 설명</Typography>
          <TextField
            placeholder="상세 설명을 입력하세요 (선택사항)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            size="small"
          />
        </Stack>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!title.trim()}
          startIcon={<AddIcon />}
        >
          추가
        </Button>
      </Stack>
    </Box>
  );
};
