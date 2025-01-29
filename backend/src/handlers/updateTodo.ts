import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const todoId = event.pathParameters?.id;
    const requestBody = JSON.parse(event.body || '{}');
    const { completed } = requestBody;

    if (!todoId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://todo-app-frontend-1738156783.s3-website.ap-northeast-2.amazonaws.com',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token',
          'Access-Control-Allow-Credentials': 'true'
        },
        body: JSON.stringify({ error: '할 일 ID가 필요합니다.' })
      };
    }

    const result = await dynamodb.update({
      TableName: TABLE_NAME,
      Key: { id: todoId },
      UpdateExpression: 'SET completed = :completed, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':completed': completed,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }).promise();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://todo-app-frontend-1738156783.s3-website.ap-northeast-2.amazonaws.com',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://todo-app-frontend-1738156783.s3-website.ap-northeast-2.amazonaws.com',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({ error: '할 일을 업데이트하는데 실패했습니다.' })
    };
  }
};
