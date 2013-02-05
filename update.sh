#!/bin/sh
export PATH=$PATH:/usr/local/bin

# update source code
cd /usr/local/xtuple/database
git pull
git submodule update --recursive

# update global db
cd server/source
psql -U admin  global -f init_script.sql
cd /usr/local/xtuple/node-datasource/installer
./installer.js -h localhost -d global -u admin -p 5432 -P admin --path ../../database/server/orm

# update instance dbs
cd /usr/local/xtuple/node-datasource
node runMaintenance.js
#wget -O - http://localhost:442/maintenance
#./updatedbs.sh

