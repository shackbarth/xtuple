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

# update libraries
git submodule update --init --recursive
cd node-datasource
npm install

# restart the datasource
monit stop node
sleep 10
monit start node
sleep 10

# update global db
cd database/source
psql -U admin  global -f init_global.sql
cd ../../installer
./installer.js -h localhost -d global -u admin -p 5432 -P admin --path ../database/orm

# update instance dbs
cd ..
node runMaintenance.js

# build extensions
cd ../enyo-client/extensions
./tools/buildExtensions.sh

# deploy enyo client
cd ../application
rm -rf deploy
cd tools
./deploy.sh
