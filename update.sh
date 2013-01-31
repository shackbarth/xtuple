#!/bin/sh
export PATH=$PATH:/usr/local/bin
cd /usr/local/xtuple/database
git pull
git submodule update --recursive
cd server/source
psql -U admin  global -f init_script.sql
cd ../../orm/installer
./installer.js -cli -h localhost -d global -u admin -p 5432 -P admin --path ../../server/orm
cd ../../
wget -O - http://localhost:442/maintenance
#./updatedbs.sh

