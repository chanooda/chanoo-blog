# Node.js 14 버전을 기반으로 하는 이미지를 사용합니다.
FROM node:14

# PNPM 설치
RUN npm install -g pnpm

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 의존성 파일을 복사합니다.
COPY package.json .
COPY pnpm-lock.yaml .

# 의존성 설치
RUN pnpm install

# 소스 코드를 현재 디렉토리로 복사합니다.
COPY . .

# 프로덕션 빌드를 수행합니다. Next.js의 경우 `build` 명령을 사용합니다.
RUN pnpm build

# 이미지 내에서 Next.js 앱이 실행되는 포트를 설정합니다.
EXPOSE 30022

# 애플리케이션 실행
CMD ["pnpm", "start"]