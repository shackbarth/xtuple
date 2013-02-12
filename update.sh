#!/bin/bash 
PRODUCTION=''

rm -rf deploy

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

# deploy
cd tools
./deploy.sh
