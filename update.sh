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
if [ $? ]
  then
    echo "error checking out master"
    exit $?
fi
exit
git pull
if [ $? ]
  then
    echo "error pulling master"
    exit $?
fi

if [ $PRODUCTION ]
  then
  git checkout `git describe --abbrev=0`
  if [ $? ]
    then
      echo "error checking out latest tag"
      exit $?
  fi
fi

# update libraries
git submodule update --init --recursive
if [ $? ]
  then
    echo "error updating submodules"
    exit $?
fi
cd node-datasource
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
