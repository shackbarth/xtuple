#XTUPLE DATABASE

This repository contains the database object definitions that enable a standard xTuple database to run in conjunction with the xTuple NodeJS Datasource (https://github.com/xtuple/datasource).

##Prerequisites

 * [PostgreSQL] (http://www.postgresql.org/) -- `v9.1.0`
 * [plV8js] (https://code.google.com/p/plv8js) -- `git clone` clone source, do *not* use tar downloads!
   - [v8] (http://github.com/v8/v8) -- `v3.6.2`
 * [Postbooks] (http://sourceforge.net/projects/postbooks) -- `v4.0.0Beta`

##Instructions

Build and install PostgreSQL from source. In the `contrib/crypto` directory `sudo make install`.   

Build the v8 library then copy the `libv8*` shared libraries to `/usr/local/lib`.  

Build the plv8js PostgreSQL extension via `make; sudo make install` (make sure to check instructions).  

Add the following to the bottom of the postgresq.conf file:
  `custom_variable_classes = 'plv8'`

From the repository root (database) run the `resetdb.py` script (`resetdb.py --help` for options) to restore from a backup and automatically run the init script. Once database is installed and init script has been run `cd installer` and make sure to modify the credentials in the `installer.js` script to match your database. Run the installed `./installer.js` and navigate in your browser to `localhost:9080/orm` and in the text field type the name of the database to connect to and press enter. Then click the `select all` and then `install selected` buttons and *cross-fingers* hope they all turn green.
