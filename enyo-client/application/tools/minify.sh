#!/bin/bash

cd `dirname $0`
PWD=$(pwd)

# build enyo
pushd ../../../
./lib/enyo-x/enyo/tools/deploy.js -p lib/enyo-x/enyo/source/package.js -b enyo-client/application/build
popd

# build app
../../../lib/enyo-x/enyo/tools/minify.sh package.js -output ../build/app
