#!/bin/bash 
PRODUCTION=''

while getopts ":p" opt; do
  case $opt in
    p)
      PRODUCTION=true
      echo 'production mode'
      ;;
  esac
done

# update source
git checkout master
git pull
if [ $PRODUCTION ]
  then
  git checkout `git describe --abbrev=0`
fi
git submodule update --init --recursive

# build the extension js files
./tools/buildExtensions.sh

# update instance dbs
# todo: we should ignore the core
cd ../node-datasource
node runMaintenance.js
