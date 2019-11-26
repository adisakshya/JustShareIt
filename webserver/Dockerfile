# Dockerfile

FROM ubuntu:latest AS base

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-wheel

COPY requirements.txt ./
RUN python3 -m pip install -r requirements.txt

EXPOSE 5001

WORKDIR /server

COPY . /server

CMD [ "python3", "server.py" ]