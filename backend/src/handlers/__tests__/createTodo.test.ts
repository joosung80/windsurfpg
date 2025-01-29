import { handler } from '../createTodo';
import { DynamoDB } from 'aws-sdk';

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      put: jest.fn().mockReturnThis(),
      promise: jest.fn()
    }))
  }
}));

const TEST_TABLE_NAME = 'TodoTable';
process.env.TABLE_NAME = TEST_TABLE_NAME;

describe('createTodo Lambda 함수', () => {
  let documentClient: DynamoDB.DocumentClient;

  beforeEach(() => {
    documentClient = new DynamoDB.DocumentClient();
  });

  it('새로운 할 일을 성공적으로 생성합니다', async () => {
    const mockTodo = {
      title: '테스트 할 일',
      description: '테스트 설명'
    };

    const event = {
      body: JSON.stringify(mockTodo)
    };

    (documentClient.put({ TableName: TEST_TABLE_NAME, Item: expect.any(Object) }).promise as jest.Mock).mockResolvedValueOnce({});

    const result = await handler(event as any);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.title).toBe(mockTodo.title);
    expect(body.description).toBe(mockTodo.description);
    expect(body.id).toBeDefined();
    expect(body.completed).toBe(false);
    expect(body.createdAt).toBeDefined();
  });

  it('제목이 없으면 400 상태코드를 반환합니다', async () => {
    const event = {
      body: JSON.stringify({
        description: '테스트 설명'
      })
    };

    const result = await handler(event as any);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error: '제목은 필수입니다.'
    });
  });

  it('DynamoDB 에러 발생 시 500 상태코드를 반환합니다', async () => {
    const event = {
      body: JSON.stringify({
        title: '테스트 할 일',
        description: '테스트 설명'
      })
    };

    (documentClient.put({ TableName: TEST_TABLE_NAME, Item: expect.any(Object) }).promise as jest.Mock).mockRejectedValueOnce(
      new Error('DynamoDB 에러')
    );

    const result = await handler(event as any);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: '할 일을 생성하는데 실패했습니다.'
    });
  });
});
