XTUPLE DATABASE
===============

This repository contains the database object definitions that enable a standard xTuple database to run in conjunction with the xTuple NodeJS Datasource (https://github.com/xtuple/datasource).

Prerequisites
-------------
 * [PostgreSQL] (http://www.postgresql.org/) -- 'v9.1.0+'
 * [plV8js] (http://code.google.com/p/plv8js/wiki/PLV8) -- clone source, do *not* do not use tar downloads!
 * [Postbooks] (http://sourceforge.net/projects/postbooks) -- 'v3.8.0+'

Instructions
------------
Build and install the plV8 language on your PostgreSQL server per instructions on the Google website. Restore a PostBooks 3.8.0 database on to your database server, then execute the following:

* 'cd postgresql'
*  psql -d [database] -U [user] -f 'init_script.sql'

Install Object Relational Map (ORM) definitions

* configure and start the xTuple [datasource] (https://github.com/xtuple/datasource). 
  Note: the datasource directory should be adjacent to this database directory on your host.
* launch the orm installer in your browser: http://localhost:9080/orm/
* click 'Select All'
* click 'Install Selected'
