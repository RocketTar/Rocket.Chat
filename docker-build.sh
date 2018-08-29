#!/bin/bash
docker build -t rockettar/rocket.chat:$1 --no-cache --force-rm --file Dockerfile ./build