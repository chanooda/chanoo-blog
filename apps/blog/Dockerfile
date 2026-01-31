FROM node:24-slim

WORKDIR /usr/src/app

# 1. standalone 폴더 전체를 복사
COPY --chown=nextjs:nodejs /app/.next/standalone ./

# 2. 정적 파일들(static, public)을 실제 앱이 위치한 경로로 복사
# 구조가 standalone/apps/blog 로 생성된다면 아래와 같이 맞춰줘야 합니다.
COPY --chown=nextjs:nodejs /app/apps/blog/public ./apps/blog/public
COPY --chown=nextjs:nodejs /app/apps/blog/.next/static ./apps/blog/.next/static

EXPOSE 3000

CMD ["node", "apps/blog/server.js"]