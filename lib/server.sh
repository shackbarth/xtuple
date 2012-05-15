#!/bin/bash

# clean up previous modules if they still exist
if [ -d "lib/node_modules" ]; then
  echo -ne "Cleaning up old dependency tree before adding new one"
  `rm -fr lib/node_modules`
  echo -ne "...done\\n"
fi 

# make sure to clone build-tools if they don't exist
# and if they do try and update?
if [ ! -d "lib/xt/node_modules/build-tools" ]; then
  if [ ! -d "lib/xt/node_modules" ]; then
    mkdir -p lib/xt/node_modules
  fi
  cd lib/xt/node_modules
  git clone git@github.com:clinuz/build-tools.git
  cd build-tools
  npm install
  cd ../../../..
else
  cd lib/xt/node_modules/build-tools
  echo -ne "Updating build-tools..."
  git pull
  cd ../../../..
fi

# will only install them if they need to be installed or
# updated
# we use force here because of (as of node 0.7.2) incompatible
# connect module version but it works (1.8.6)
cd lib/xt; npm install; cd ../..; node ./lib/main.js $@

exit 0
