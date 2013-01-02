#!/bin/sh
git pull
git submodule update --recursive
cd tools
./deploy.sh

