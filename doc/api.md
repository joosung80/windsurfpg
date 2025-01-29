# Todo API 문서

## 기본 URL
```
https://cwxhc8o84b.execute-api.ap-northeast-2.amazonaws.com/prod
```

## 엔드포인트

### 할 일 목록 조회
- **URL**: `/todos`
- **Method**: `GET`
- **Description**: 모든 할 일 항목을 조회합니다.
- **Response**:
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "completed": boolean,
      "createdAt": "string"
    }
  ]
  ```

### 할 일 생성
- **URL**: `/todos`
- **Method**: `POST`
- **Description**: 새로운 할 일을 생성합니다.
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "completed": false,
    "createdAt": "string"
  }
  ```

### 할 일 수정
- **URL**: `/todos/{id}`
- **Method**: `PUT`
- **Description**: 기존 할 일의 상태를 수정합니다.
- **URL Parameters**:
  - `id`: 할 일의 고유 식별자
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "completed": boolean
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "completed": boolean,
    "createdAt": "string"
  }
  ```

### 할 일 삭제
- **URL**: `/todos/{id}`
- **Method**: `DELETE`
- **Description**: 할 일을 삭제합니다.
- **URL Parameters**:
  - `id`: 할 일의 고유 식별자
- **Response**:
  ```json
  {
    "message": "할 일이 삭제되었습니다."
  }
  ```

## 에러 응답
모든 API 엔드포인트는 에러 발생 시 다음과 같은 형식으로 응답합니다:
```json
{
  "error": "에러 메시지"
}
```

### 상태 코드
- `200`: 성공
- `201`: 리소스 생성 성공
- `400`: 잘못된 요청
- `500`: 서버 에러

## CORS
- 허용된 오리진: `http://todo-app-frontend-1738156783.s3-website.ap-northeast-2.amazonaws.com`
- 허용된 메서드: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- 허용된 헤더: `Content-Type`, `Authorization`, `X-Amz-Date`, `X-Api-Key`, `X-Amz-Security-Token`
