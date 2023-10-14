cd /home/ubuntu/blog

docker system prune --force

docker stop blog
docker rm blog
docker image rm blog
docker build -t blog -f ./blog.dockerfile .
docker run -dit -p 30021:3000 --name blog blog

docker stop blog-admin
docker rm blog-admin
docker image rm blog-admin
docker build -t blog-admin -f ./blog-admin.dockerfile .
docker run -d -p 30022:80 --name blog-admin blog-admin