#!/bin/bash

cd `dirname $0`
PWD=$(pwd)

# build enyo
pushd ../../../lib/enyo-x/enyo
./tools/deploy.js -p source/package.js
cp build/enyo.* ../../../enyo-client/application/build/
popd

# build app
../../../lib/enyo-x/enyo/tools/minify.sh package.js -output ../build/app
