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

# rebuild the client and database sides of the app
./scripts/build_app.js
