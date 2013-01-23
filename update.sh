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

git_status=$(git pull  2> /dev/null)
#echo ${git_status}
if [[ ! ${git_status} =~ 'Already up-to-date.' ]]  
  then 
  if [ $PRODUCTION ]
	then
	#echo $PRODUCTION 
	git checkout `git describe --tags`
  fi
  git submodule update --recursive
  cd tools
  ./deploy.sh
fi

