FROM node:24-slim

WORKDIR /usr/src/app

COPY .next/standalone .
COPY .next/static ./static
COPY public ./public

EXPOSE 3000

CMD ["node", "apps/blog/server.js"]