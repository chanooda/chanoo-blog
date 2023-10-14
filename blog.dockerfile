FROM node:18-slim

# PNPM 설치
RUN npm install -g pnpm

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 의존성 파일을 복사합니다.
COPY package.json .

# 의존성 설치
RUN pnpm install

# 소스 코드를 현재 디렉토리로 복사합니다.
COPY . .

# 프로덕션 빌드를 수행합니다. Vite의 경우 `build` 명령을 사용합니다.
RUN pnpm build

# 이미지 내에서 리액트 앱이 실행되는 포트를 설정합니다.
EXPOSE 30021

# 애플리케이션 실행
CMD ["pnpm", "serve"]