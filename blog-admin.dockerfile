FROM node:18-slim as build


# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 소스 코드를 현재 디렉토리로 복사합니다.
COPY ./apps/blog-admin .

FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /usr/share/nginx/html
# COPY --from=build /app/dist /var/www/html

RUN rm -rf /etc/nginx/sites-enabled/default
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 환경 변수 설정
ENV NODE_ENV=production
ENV VITE_APP_BLOG_ADMIN_BASE_URL=http://54.180.17.252:4000

# 이미지 내에서 Next.js 앱이 실행되는 포트를 설정합니다.
EXPOSE 30022

# 애플리케이션 실행
CMD ["nginx","-g","daemon off;"]