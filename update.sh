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
git_status=$(git pull  2> /dev/null)
#echo ${git_status}
if [[ ! ${git_status} =~ 'Already up-to-date.' ]]  
  then 
  if [ $PRODUCTION ]
	then
	#echo $PRODUCTION 
	git checkout `git describe --tags`
  fi
  git submodule update --init --recursive
  ./tools/buildExtensions.sh
pushd .
cd source/incident_plus/database/source
 psql \
  -X -A \
  -h localhost \
  -U admin \
  -t \
  -F ' ' \
  --quiet \
  -c "select org_name as db, org_dbserver_name as server from xt.org where org_active = 't'" \
    global | while read -a Record; do
     db=${Record[0]}
     server=${Record[1]}

     psql -U admin -h $server -d $db  -f init_script.sql

 done
popd
wget -o - http://localhost:442/maintenance
fi

