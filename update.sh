#!/bin/bash
PRODUCTION=''
HOST='localhost'

usage()
{
   cat << EOF
   usage: $0 options
   update the environment
   OPTIONS:
   -h target host
   -p production mode
EOF
}
while getopts ":ph:" opt; do
  case $opt in
    p)
      PRODUCTION=true
      echo 'production mode'
      ;;
    h)
      HOST=$OPTARG
      ;;
    ?)
      usage
      exit
      ;;
  esac
done

# update source

git checkout master
if [ $? != 0  ]
  then
    echo "error checking out master"
    exit $?
fi

git pull
if [ $? != 0  ]
  then
    echo "error pulling master"
    exit $?
fi

if [ $PRODUCTION ]
  then
  git checkout `git describe --abbrev=0`
  if [ $? != 0  ]
    then
      echo "error checking out latest tag"
      exit $?
  fi
fi

# update libraries
git submodule update --init --recursive
if [ $? != 0  ]
  then
    echo "error updating submodules"
    exit $?
fi

# remove all npm packages and reinstall them to get the latest.
rm -rf node_modules
npm install

# restart the datasource
monit stop node
sleep 10
monit start node
sleep 10

# update global db
cd database/source
psql -U admin  -h $HOST global -f init_global.sql
cd ../../installer
./installer.js -h $HOST -d global -u admin -p 5432 -P admin --path ../database/orm

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
