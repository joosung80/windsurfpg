#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 배포 프로세스를 시작합니다...${NC}"

# 백엔드 배포
echo -e "${BLUE}📦 백엔드 배포 시작...${NC}"
cd backend
npm install
npm run build
cdk deploy --require-approval never

# API Gateway URL 가져오기
API_URL=$(aws cloudformation describe-stacks --stack-name TodoAppStack --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text)
USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name TodoAppStack --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' --output text)
USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks --stack-name TodoAppStack --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' --output text)
IDENTITY_POOL_ID=$(aws cloudformation describe-stacks --stack-name TodoAppStack --query 'Stacks[0].Outputs[?OutputKey==`IdentityPoolId`].OutputValue' --output text)

echo -e "${GREEN}✅ 백엔드 배포 완료${NC}"

# 프론트엔드 환경 변수 설정
cd ../frontend
echo "REACT_APP_API_URL=$API_URL
REACT_APP_USER_POOL_ID=$USER_POOL_ID
REACT_APP_USER_POOL_CLIENT_ID=$USER_POOL_CLIENT_ID
REACT_APP_IDENTITY_POOL_ID=$IDENTITY_POOL_ID
REACT_APP_AWS_REGION=ap-northeast-2" > .env.production

# 프론트엔드 빌드 및 배포
echo -e "${BLUE}🎨 프론트엔드 배포 시작...${NC}"
npm install
npm run build

# S3 버킷 생성 및 웹사이트 호스팅 설정
BUCKET_NAME="todo-app-frontend-$(date +%s)"
aws s3 mb s3://$BUCKET_NAME
aws s3api put-public-access-block --bucket $BUCKET_NAME --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# 버킷 정책 설정
echo "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [
        {
            \"Sid\": \"PublicReadGetObject\",
            \"Effect\": \"Allow\",
            \"Principal\": \"*\",
            \"Action\": \"s3:GetObject\",
            \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/*\"
        }
    ]
}" > bucket-policy.json

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
rm bucket-policy.json

# 빌드된 파일 업로드
aws s3 sync build/ s3://$BUCKET_NAME

echo -e "${GREEN}✅ 프론트엔드 배포 완료${NC}"
echo -e "${GREEN}🌐 프론트엔드 URL: http://$BUCKET_NAME.s3-website.ap-northeast-2.amazonaws.com${NC}"

echo -e "${GREEN}🎉 전체 배포가 완료되었습니다!${NC}"
