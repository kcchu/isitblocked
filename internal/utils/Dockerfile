# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.154.2/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 14, 12, 10
ARG VARIANT="14-buster"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

ARG PROTOC_VERSION=3.14.0
ARG GRPC_WEB_VERSION=1.2.1

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && mkdir /tmp/prototools \
    && cd /tmp/prototools \
    && apt-get install -y unzip --no-install-recommends \
    && curl -sSL https://github.com/protocolbuffers/protobuf/releases/download/v${PROTOC_VERSION}/protoc-${PROTOC_VERSION}-linux-$(uname -m).zip -o protoc.zip \
    && unzip protoc.zip -d /usr/local \
    && curl -sSL https://github.com/grpc/grpc-web/releases/download/${GRPC_WEB_VERSION}/protoc-gen-grpc-web-${GRPC_WEB_VERSION}-linux-$(uname -m) -o /usr/local/bin/protoc-gen-grpc-web \
    && chmod +x /usr/local/bin/protoc-gen-grpc-web \
    #
    # Clean up
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /tmp/prototools

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"
