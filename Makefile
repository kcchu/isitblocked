BIN_IMAGE_TAG=kcchu/isitblocked:latest
WEB_IMAGE_TAG=kcchu/isitblocked-web:latest
PROXY_IMAGE_TAG=kcchu/isitblocked-proxy:latest
PLATFORMS=linux/amd64,linux/arm64

.PHONY: bin web proxy

all: bin web proxy

bin:
	docker buildx build --platform ${PLATFORMS} --push -f deployments/dockerfiles/bin/Dockerfile -t ${BIN_IMAGE_TAG} .

web:
	docker build -f deployments/dockerfiles/web/Dockerfile -t ${WEB_IMAGE_TAG} .
	docker push ${WEB_IMAGE_TAG}

proxy:
	docker build -f deployments/dockerfiles/proxy/Dockerfile -t ${PROXY_IMAGE_TAG} .
	docker push ${PROXY_IMAGE_TAG}