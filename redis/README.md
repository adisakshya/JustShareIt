# Redis Caching

## Testing

- Build the docker image by running following command
```
docker build -t redis-cache .
```

- Run the container using following command
```
docker run -p 6379:6379 --name some-redis -d redis
```