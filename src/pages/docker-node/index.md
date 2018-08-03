---
path: "/docker-node"
date: "2017-05-09T07:00:00.000Z"
title: "Docker-izing a Node Web app (NPM/Webpack)
"
---

After implementation of my web app for Raspberry SenseHat with ReactJs, I decided to dockerize it so maybe later I run it on AWS ECS (Amazon EC2 Container Service).(Actually not this web app but other project that I have, should be run on AWS ECS)

First I want to use Docker Hub to push my image and later I can pull from it wherever I want to (Apparently it is GitHub for docker images). Therefore, I created an account on Docker Hub and I created a repository named “sensehat-react”. Later when I create my docker image I’ll push it to this repository.
Let’s see what I have:
I have a Node web app which uses webpack as a loader and “npm to install my needed modules and I run it.
This is my exact **package.json**:

```json
{
  "name": "sensehat-react",
  "version": "1.0.0",
  "description": "Dashboard for SenseHat",
  "main": "index.js",
  "scripts": {
    "production": "webpack -p",
    "start": "webpack-dev-server"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/farminf/sensehat-react.git"
  },
  "keywords": ["SenseHat", "reactjs", "bootstrap", "dashboard"],
  "author": "IoTGuy <iotdemos16@gmail.com> (https://iotdemos.wordpress.com)",
  "license": "Apache-2.0",
  "bugs": {
    "url": "https://github.com/farminf/sensehat-react/issues"
  },
  "homepage": "https://github.com/farminf/sensehat-react#readme",
  "dependencies": {
    "axios": "^0.15.3",
    "react": "^15.4.2",
    "react-bootstrap": "^0.30.7",
    "react-bootstrap-switch": "^15.5.0",
    "react-d3-basic": "^1.6.11",
    "react-d3-core": "^1.3.9",
    "react-dom": "^15.4.2",
    "react-fontawesome": "^1.5.0",
    "react-icons": "^2.2.3",
    "react-router": "^3.0.2",
    "react-rt-chart": "^1.3.0"
  },
  "devDependencies": {
    "babel": "^6.23.0",
    "babel-core": "^6.23.1",
    "babel-loader": "^6.3.2",
    "babel-preset-es2015": "^6.24.0",
    "babel-preset-react": "^6.23.0",
    "file-loader": "^0.10.1",
    "html-webpack-plugin": "^2.28.0",
    "image-webpack-loader": "^3.3.0",
    "install": "^0.8.7",
    "npm": "^4.3.0",
    "webpack": "^2.2.1",
    "webpack-dev-server": "^2.4.1"
  }
}
```

I need to build my Dockerfile based on my settings:

- My node project folder doesn’t have node_module folder(because it is clean: just cloned from GitHub)
- I need to do “npm install” to download my libraries in node_module folder
- Then for Running I need to run “npm start”
- Unfortunately, I am behind the proxy so I should think about that too (Damn proxy which makes everything complicated)

I have written my Dockerfile and put it in the root folder:

```bash
FROM node:6.10

RUN mkdir /sensehat-react-app
COPY . /sensehat-react-app
WORKDIR /sensehat-react-app

RUN npm config set proxy http://proxy-ip:proxy-port
RUN npm config set https-proxy http://proxy-ip:proxy-port
#If there is some dependency that uses not npm proxy but system one
#you need to export the proxy here too

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]
```

Great, I have everythings ready to build my docker image and run it locally so I can be sure that it is working.
After installation of Docker ([Ubuntu installation](https://docs.docker.com/engine/installation/linux/ubuntu/#docker-ee-customers)) I go to terminal and my root folder.
I build my docker image:

```bash
sudo docker build -t $docker_hub_username/$repository_name:$tag .
```

then I run it in the way that I can browse it on http://localhost:69160

```bash
sudo docker run -d -p 49160:8080 $docker_hub_username/$repository_name:$tag
```

I test it and I browse to ‘http://localhost:69160‘ and surprisingly I get “Connection reset error” 😦

Then I remember that in my package.json file, in start script I haven’t indicate that Webpack web-server should be accessible from the network. I change the start script to:

```
webpack-dev-server --port 8080 --host 0.0.0.0
```

and save it… but the thing is I update my local code and not my Docker container so I have 2 ways to do that, I can copy just this file to my docker using ‘docker cp’ command or I can stop the current image, remove it and re-do the build part. I choose second one:

```bash
docker ps
#to see my dockers running
docker stop $Container ID
docker images
#See images id
Docker rmi -f $Image ID
```

and re-do the build and run with new tag. Perfect now I can browse to my web app. I am happy 🙂

ok let’s put the docker on the Docker Hub using the properties of my Docker hub account then:

```bash
docker tag $image_id $userID/$RepositoryName:$tag
sudo docker push $userID/$RepositoryName:$tag
```

first time I got the error: ‘denied: requested access to the resource is denied’ but then I did

```bash
docker login
#It asks you for username and password of Docker Hub
```

And again push, and It upload it on my Docker Hub 🙂

Perfect, so I have my web app image there and wherever which it has docker running I can run my app, I just need to pull it and run it, no need to setup anything or install anything.
Next I try to run it on my AWS ECS service…
