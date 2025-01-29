# 모니터링 가이드

## CloudWatch 로그

### Lambda 함수 로그
모든 Lambda 함수의 로그는 CloudWatch Logs에서 다음 로그 그룹에서 확인할 수 있습니다:
- `/aws/lambda/BackendStack-GetTodosFunction-*`
- `/aws/lambda/BackendStack-CreateTodoFunction-*`
- `/aws/lambda/BackendStack-UpdateTodoFunction-*`
- `/aws/lambda/BackendStack-DeleteTodoFunction-*`

로그 보존 기간은 1주일로 설정되어 있습니다.

### API Gateway 로그
API Gateway 액세스 로그는 CloudWatch Logs에서 확인할 수 있습니다.

## CloudWatch 알람

### API Gateway 알람
- **알람 이름**: `TodoApi-5XX-Errors`
- **설명**: API Gateway에서 5XX 에러가 발생할 때 알람을 발생시킵니다.
- **임계값**: 5분 동안 5회 이상의 5XX 에러 발생 시
- **평가 기간**: 1회

### Lambda 함수 알람
- **알람 이름**: `TodoApi-Lambda-Errors`
- **설명**: Lambda 함수에서 에러가 발생할 때 알람을 발생시킵니다.
- **임계값**: 5분 동안 3회 이상의 에러 발생 시
- **평가 기간**: 1회

## 주요 지표

### API Gateway 지표
- 요청 수
- 지연 시간
- 4XX 에러율
- 5XX 에러율
- 통합 지연 시간

### Lambda 지표
- 호출 수
- 에러 수
- 지연 시간
- 동시 실행 수
- 제한 시간 초과 수

### DynamoDB 지표
- 읽기/쓰기 용량 단위 소비
- 제한된 요청 수
- 지연 시간
- 시스템 에러

## 대시보드
CloudWatch 대시보드에서 다음 지표들을 모니터링할 수 있습니다:
1. API Gateway 성능
2. Lambda 함수 성능
3. DynamoDB 성능
4. 전체 시스템 상태

## 트러블슈팅

### 일반적인 문제 해결 방법
1. CloudWatch Logs에서 관련 로그 확인
2. API Gateway 메트릭 확인
3. Lambda 함수 메트릭 확인
4. DynamoDB 메트릭 확인

### 로그 분석
로그 인사이트를 사용하여 다음과 같은 쿼리를 실행할 수 있습니다:

```
fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

### 알람 대응
1. 알람 발생 시 로그 확인
2. 에러 원인 파악
3. 필요한 조치 수행
4. 알람 해결 확인
