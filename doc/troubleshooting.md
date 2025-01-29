# 트러블슈팅 가이드

## 일반적인 문제 해결

### 1. CORS 에러
#### 증상
- 브라우저 콘솔에 CORS 관련 에러 메시지가 표시됩니다.
- API 요청이 실패합니다.

#### 해결 방법
1. API Gateway CORS 설정 확인
   ```bash
   aws apigateway get-rest-api --rest-api-id cwxhc8o84b
   ```

2. Lambda 함수의 응답 헤더 확인
   ```typescript
   {
     headers: {
       'Access-Control-Allow-Origin': 'http://todo-app-frontend-1738156783.s3-website.ap-northeast-2.amazonaws.com',
       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
       'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token',
     }
   }
   ```

### 2. API 타임아웃
#### 증상
- API 요청이 504 에러와 함께 실패합니다.
- Lambda 함수가 응답하지 않습니다.

#### 해결 방법
1. Lambda 함수 타임아웃 설정 확인
2. CloudWatch 로그에서 실행 시간 확인
3. DynamoDB 응답 시간 모니터링

### 3. DynamoDB 오류
#### 증상
- API가 500 에러를 반환합니다.
- CloudWatch 로그에 DynamoDB 관련 에러가 표시됩니다.

#### 해결 방법
1. DynamoDB 테이블 상태 확인
   ```bash
   aws dynamodb describe-table --table-name Todos
   ```

2. 프로비저닝된 용량 확인
3. CloudWatch 메트릭에서 제한(Throttling) 여부 확인

### 4. 프론트엔드 빌드 실패
#### 증상
- GitHub Actions 빌드가 실패합니다.
- S3 배포가 실패합니다.

#### 해결 방법
1. GitHub Actions 로그 확인
2. 의존성 패키지 버전 확인
3. 환경 변수 설정 확인

## 성능 최적화

### 1. API 응답 시간 개선
- CloudWatch Insights를 사용하여 느린 요청 식별
- Lambda 함수 메모리 할당량 조정
- DynamoDB 인덱스 최적화

### 2. 프론트엔드 성능
- React 컴포넌트 렌더링 최적화
- 불필요한 리렌더링 방지
- 코드 스플리팅 적용

## 보안 문제

### 1. API 인증 실패
#### 증상
- 401 또는 403 에러 발생
- API 요청이 거부됩니다.

#### 해결 방법
1. API Gateway 인증 설정 확인
2. Lambda 함수의 IAM 역할 권한 확인
3. CORS 프리플라이트 요청 처리 확인

### 2. S3 접근 문제
#### 증상
- 프론트엔드 웹사이트에 접근할 수 없습니다.
- 정적 파일 로딩 실패

#### 해결 방법
1. S3 버킷 정책 확인
2. 정적 웹사이트 호스팅 설정 확인
3. CloudFront 캐시 설정 확인 (사용 시)

## 모니터링 및 알림

### CloudWatch 알람 대응
1. API Gateway 5XX 에러 알람
   - 로그 분석으로 에러 원인 파악
   - Lambda 함수 로그 확인
   - DynamoDB 상태 확인

2. Lambda 에러 알람
   - 함수 타임아웃 확인
   - 메모리 사용량 확인
   - 의존성 패키지 문제 확인

## 배포 문제

### 1. CDK 배포 실패
#### 증상
- `cdk deploy` 명령이 실패합니다.
- CloudFormation 스택 업데이트 실패

#### 해결 방법
1. CloudFormation 이벤트 로그 확인
2. IAM 권한 확인
3. 리소스 제약 조건 확인

### 2. 프론트엔드 배포 실패
#### 증상
- GitHub Actions 워크플로우 실패
- S3 업로드 실패

#### 해결 방법
1. GitHub Actions 시크릿 설정 확인
2. AWS 인증 정보 확인
3. S3 버킷 권한 확인

## 유용한 명령어

### AWS CLI
```bash
# API Gateway 로그 확인
aws logs tail /aws/apigateway/TodoApi --since 1h

# Lambda 함수 로그 확인
aws logs tail /aws/lambda/BackendStack-GetTodosFunction

# DynamoDB 테이블 상태 확인
aws dynamodb describe-table --table-name Todos
```

### 로그 분석 쿼리
```
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 20
```
