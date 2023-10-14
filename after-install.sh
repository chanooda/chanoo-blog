cd /home/ubuntu/blog
docker stop blog
docker rm blog
docker image rm blog
docker build -t blog .
docker run -dit -p 30021:3000 --name blog blog

cd /home/ubuntu/blog-admin
docker stop blog-admin
docker rm blog-admin
docker image rm blog-admin
docker build -t blog-admin .
docker run -dit -p 30021:3000 --name blog-admin blog-admin