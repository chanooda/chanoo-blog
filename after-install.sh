npm install -g pnpm
pnpm install
pnpm build

docker stop blog
docker rm blog
docker image rm blog
docker build -t blog -f ./blog.dockerfile ./apps/blog
docker run -dit -p 30021:3000 --name blog blog

docker stop blog-admin
docker rm blog-admin
docker image rm blog-admin
docker build -t blog-admin -f ./blog-admin.dockerfile ./apps/blog-admin
docker run -dit -p 30022:3000 --name blog-admin blog-admin