import { handler } from '../getTodos';
import { DynamoDB } from 'aws-sdk';

// DynamoDB 클라이언트 모킹
jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      scan: jest.fn().mockReturnThis(),
      promise: jest.fn()
    }))
  }
}));

const TEST_TABLE_NAME = 'TodoTable';
process.env.TABLE_NAME = TEST_TABLE_NAME;

describe('getTodos Lambda 함수', () => {
  let documentClient: DynamoDB.DocumentClient;

  beforeEach(() => {
    documentClient = new DynamoDB.DocumentClient();
  });

  it('할 일 목록을 성공적으로 조회합니다', async () => {
    const mockTodos = [
      {
        id: '1',
        title: '테스트 할 일',
        description: '테스트 설명',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];

    (documentClient.scan({ TableName: TEST_TABLE_NAME }).promise as jest.Mock).mockResolvedValueOnce({
      Items: mockTodos
    });

    const result = await handler({} as any);

    expect(JSON.parse(result.body)).toEqual(mockTodos);
    expect(result.statusCode).toBe(200);
  });

  it('에러가 발생하면 500 상태코드를 반환합니다', async () => {
    (documentClient.scan({ TableName: TEST_TABLE_NAME }).promise as jest.Mock).mockRejectedValueOnce(
      new Error('DynamoDB 에러')
    );

    const result = await handler({} as any);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: '할 일 목록을 가져오는데 실패했습니다.'
    });
  });
});
