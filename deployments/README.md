# Deployment

## Build and publish Docker images

1. Set up docker multi-CPU architecture support: https://docs.docker.com/docker-for-mac/multi-arch/
2. Verify docker buildx configuration: ```docker buildx inspect --bootstrap```
2. Login Docker: ```docker login```
3. In project root directory, run: ```make```