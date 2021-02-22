FROM golang:1.14

WORKDIR /src
COPY . /src
RUN go build github.com/kcchu/isitblocked/cmd/isitblocked

FROM debian:buster-slim

RUN apt-get update && apt-get install -y curl && \
    curl -fsSL -o /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64 && \
    chmod +x /usr/local/bin/dbmate

WORKDIR /app
COPY --from=0 /src/isitblocked .
COPY --from=0 /src/db ./db

ENTRYPOINT [ "/app/isitblocked" ]