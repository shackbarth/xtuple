#XTUPLE DATABASE

This repository contains implementation specific object relational maps and functions to support xTuple applications.

##Prerequisites

 * [PostgreSQL] (http://www.postgresql.org/) -- `v9.1.0`
 * [plV8js] (http://www.pgxn.org/dist/plv8/) -- `1.2`
   - [v8] (http://github.com/v8/v8) -- `v3.6.2`
 * [NodeJS] (http://nodejs.org/) -- `v.0.6.18`
 * [Postbooks] (http://sourceforge.net/projects/postbooks) -- `v4.0.0`


##Instructions

Follow instructions for database setup on xTuple [ORM] (https://github.com/xtuple/orm/blob/master/README.md).

To initiate this repository:

    git clone git@github.com:xtuple/database.git
    cd database
    git submodule update --init
  
To install orms on an existing xTuple 4.x database:

    cd client/source
    psql -U {user} -d {database} -p {port} -h {hostname} -f "init_script.sql"
    cd ../../orm/installer
    npm install
    ./installer.js -cli -h {hostname} -d {database} -u {username} -p {port} -P {password} --path "../../client/orm"