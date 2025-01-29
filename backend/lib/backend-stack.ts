import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Cognito 사용자 풀 생성
    const userPool = new cognito.UserPool(this, 'TodoUserPool', {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    });

    // 사용자 풀 클라이언트 생성
    const userPoolClient = new cognito.UserPoolClient(this, 'TodoUserPoolClient', {
      userPool,
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
        custom: true,
        userSrp: true,
      },
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        callbackUrls: ['http://localhost:3000', 'https://your-production-domain.com'],
        logoutUrls: ['http://localhost:3000', 'https://your-production-domain.com'],
      },
    });

    // ID 풀 생성 (익명 인증 허용)
    const identityPool = new cognito.CfnIdentityPool(this, 'TodoIdentityPool', {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{
        clientId: userPoolClient.userPoolClientId,
        providerName: userPool.userPoolProviderName,
      }],
    });

    // 인증되지 않은 사용자를 위한 IAM 역할
    const unauthenticatedRole = new cdk.aws_iam.Role(this, 'CognitoUnauthRole', {
      assumedBy: new cdk.aws_iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': identityPool.ref,
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'unauthenticated',
        },
      }, 'sts:AssumeRoleWithWebIdentity'),
    });

    // 인증된 사용자를 위한 IAM 역할
    const authenticatedRole = new cdk.aws_iam.Role(this, 'CognitoAuthRole', {
      assumedBy: new cdk.aws_iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': identityPool.ref,
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated',
        },
      }, 'sts:AssumeRoleWithWebIdentity'),
    });

    // ID 풀에 역할 연결
    new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
        unauthenticated: unauthenticatedRole.roleArn,
      },
    });

    // DynamoDB 테이블 생성
    const todosTable = new dynamodb.Table(this, 'TodosTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda 함수들 생성
    const getTodosFunction = new nodejs.NodejsFunction(this, 'GetTodosFunction', {
      entry: path.join(__dirname, '../src/handlers/getTodos.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: todosTable.tableName,
      },
    });

    const createTodoFunction = new nodejs.NodejsFunction(this, 'CreateTodoFunction', {
      entry: path.join(__dirname, '../src/handlers/createTodo.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: todosTable.tableName,
      },
    });

    const updateTodoFunction = new nodejs.NodejsFunction(this, 'UpdateTodoFunction', {
      entry: path.join(__dirname, '../src/handlers/updateTodo.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: todosTable.tableName,
      },
    });

    const deleteTodoFunction = new nodejs.NodejsFunction(this, 'DeleteTodoFunction', {
      entry: path.join(__dirname, '../src/handlers/deleteTodo.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: todosTable.tableName,
      },
    });

    // DynamoDB 테이블에 대한 권한 부여
    todosTable.grantReadData(getTodosFunction);
    todosTable.grantWriteData(createTodoFunction);
    todosTable.grantWriteData(updateTodoFunction);
    todosTable.grantWriteData(deleteTodoFunction);

    // API Gateway 생성
    const api = new apigateway.RestApi(this, 'TodosApi', {
      restApiName: 'Todo Service',
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://joosung80.github.io'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: [
          'Content-Type',
          'Authorization',
          'X-Amz-Date',
          'X-Api-Key',
          'X-Amz-Security-Token'
        ],
        allowCredentials: false
      }
    });

    // API 엔드포인트 설정
    const todos = api.root.addResource('todos');
    todos.addMethod('GET', new apigateway.LambdaIntegration(getTodosFunction));
    todos.addMethod('POST', new apigateway.LambdaIntegration(createTodoFunction));

    const todo = todos.addResource('{id}');
    todo.addMethod('PUT', new apigateway.LambdaIntegration(updateTodoFunction));
    todo.addMethod('DELETE', new apigateway.LambdaIntegration(deleteTodoFunction));

    // CloudWatch 알람 설정
    const apiErrorAlarm = new cloudwatch.Alarm(this, 'ApiErrorAlarm', {
      metric: api.metricServerError({
        period: cdk.Duration.minutes(5),
        statistic: 'sum'
      }),
      threshold: 5,
      evaluationPeriods: 1,
      alarmDescription: 'API Gateway 5XX 에러 발생 시 알람',
      alarmName: 'TodoApi-5XX-Errors'
    });

    const lambdaErrorAlarm = new cloudwatch.Alarm(this, 'LambdaErrorAlarm', {
      metric: getTodosFunction.metricErrors({
        period: cdk.Duration.minutes(5),
        statistic: 'sum'
      }),
      threshold: 3,
      evaluationPeriods: 1,
      alarmDescription: 'Lambda 함수 에러 발생 시 알람',
      alarmName: 'TodoApi-Lambda-Errors'
    });

    // CloudWatch 로그 보존 기간 설정
    new logs.LogGroup(this, 'GetTodosLogGroup', {
      logGroupName: `/aws/lambda/${getTodosFunction.functionName}`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    new logs.LogGroup(this, 'CreateTodoLogGroup', {
      logGroupName: `/aws/lambda/${createTodoFunction.functionName}`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    new logs.LogGroup(this, 'UpdateTodoLogGroup', {
      logGroupName: `/aws/lambda/${updateTodoFunction.functionName}`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    new logs.LogGroup(this, 'DeleteTodoLogGroup', {
      logGroupName: `/aws/lambda/${deleteTodoFunction.functionName}`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // 출력값 추가
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: 'User Pool ID',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'User Pool Client ID',
    });

    new cdk.CfnOutput(this, 'IdentityPoolId', {
      value: identityPool.ref,
      description: 'Identity Pool ID',
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });
  }
}
