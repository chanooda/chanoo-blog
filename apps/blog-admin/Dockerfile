FROM nginx:alpine

WORKDIR /usr/src/app

# 빌드된 파일을 nginx에 복사
COPY dist /usr/share/nginx/html

# nginx 설정 파일 복사
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 포트 설정
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]