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

git checkout master
git pull
if [ $PRODUCTION ]
  then
  git checkout `git describe --abbrev=0`
fi

npm install
monit stop node
sleep 10
monit start node

