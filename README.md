XTUPLE DATASOURCE
=================

The datasource requires the following components before being able to be run.

Prerequisites
-------------

* [Node.js] (https://github.com/joyent/node) -- `v0.7.2`
* [Redis] (https://github.com/antirez/redis) -- `v2.6.0` (if running locally)

Instructions
------------  
  
Once the datasource source has been cloned, from the project root simply execute `./server` and it will attempt to install/update any of its dependencies and npm required packages including building the native bindings for the PostgreSQL driver. Should the auto installer fail it is usually caused by a permissions issue or incorrect version of node/npm. If it is a permissions issue you will need to `cd lib/xt` and `sudo npm install --force`. If this does not resolve the issue, may God have mercy on your soul...and you probably have some other issues with your environment.   

Also note that the datasource clones and maintains its own copy of the xTuple build-tools project. If the npm install fails with version mismatch errors, try the same as above `cd lib/xt/node_modules/build-tools; npm install --force`.

Configuration
-------------

By default the datasource looks for and reads from a configuration file `lib/config.js`. This file can be overriden at runtime by passing the `-c path/to/custom_config.js`. In the default configuration file some inline comments describe the settings and what they are for. The options are key/value pairs collected by associated module. If some of these settings need to be modified (and they would for any production environment or network available development environment) it is advised that a copy of the `lib/config.js` file be made and modified and executed using the override method just described.   
