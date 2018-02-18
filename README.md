# cached-and-queued-app-poc
A proof of concept using various technologies for a application architecture and deployment strategy which implements a web application that off loads the work of  rendering web pages to workers processing a queue.

## Run via docker-compose

Install front node dependencies
```
docker-compose run front npm install
```

Install back node dependencies
```
docker-compose run back npm install
```

Start the services
```
docker-compose up
```
