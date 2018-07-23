#!/bin/bash
meteor npm install --production
set +e
meteor add rocketchat:lib
set -e
mkdir -p build
METEOR_ALLOW_SUPERUSER=true meteor build --allow-superuser --server-only --architecture os.linux.x86_64 build/rocket.chat.tgz