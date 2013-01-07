#!/bin/sh
export PATH=$PATH:/usr/bin:/usr/local/bin
git pull
git submodule update --recursive
./tools/buildExtensions.sh

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

cd /usr/local/xtuple/database/orm/installer/
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
    
    ./installer.js -cli -h $server -d $db -u admin -p 5432 -P admin --path ../../../public-extensions/source/incident_plus/database/orm/

 done
