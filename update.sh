#!/bin/bash
export PATH=$PATH:/usr/local/bin
PRODUCTION=''

while getopts ":p" opt; do
  case $opt in
    p)
      PRODUCTION=true
      echo 'production mode'
      ;;
  esac
done

# update source code
cd /usr/local/xtuple/database
git pull
if [ $PRODUCTION ]
  then
  git checkout `git describe --abbrev=0`
fi
git submodule update --init --recursive

# update global db
cd server/source
psql -U admin  global -f init_script.sql
cd /usr/local/xtuple/node-datasource/installer
./installer.js -h localhost -d global -u admin -p 5432 -P admin --path ../../database/server/orm

# update instance dbs
cd /usr/local/xtuple/node-datasource
node runMaintenance.js
