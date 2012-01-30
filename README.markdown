XTUPLE DATASOURCE
=================

The datasource requires the following components before being able to be run.

Prerequisites
-------------

* [Node.js] (https://github.com/joyent/node) -- `v0.6.3+`

Instructions
------------

Once node is built and available in your path (see notes at bottom on building
and installing node) you can clone this repository. You will need to execute the
simple setup.sh script from within the lib directory. Once that has been executed
npm should have installed all of the necessary 3rd party modules and you can
execute the project-root-level server alias (points to `lib/server.sh`) and either
specify settings from the command line or use the `-c` option and pass it a path
to a configuration json file. For more information just run `./server` or `./server -h`
to see the full list of command-line options.

* `cd lib`
* `./setup.sh` -- installs 3rd-party modules
* `cd ..`
* `./server -h` -- will show the command line options

For an example configuration json file look at `lib/config.json`.

Notes on building Node.js
-------------------------

In general you need to follow the directions as supplied with the project. It is
imperative that node builds with openssl support. If you have a custom build of
openssl there are two special command-line directives that need to be passed to 
`./configure` so that it knows where to look (or you might wind up with some
ambiguous compile errors). 

* [library] `--openssl-libpath=PATH_TO_OPENSSL_LIB`
* [includes] `--openssl-includes=PATH_TO_OPENSSL_INCLUDES`

In both cases it is important to note that the paths do not need to include the `lib`
or `include` in the path. So, for example, if I had openssl installed in `/usr/local/openssl`, 
within that directory there would be a `lib` and a `include` directory but for the path
supplied to the above options it would merely be `--openssl-libpath=/usr/local/openssl` and
`--openssl-includes=/usr/local/openssl` because the node waf system automatically searches
for the suffix.

It is also imperative that node be in your path and you can assist additional modules
by providing a NODE_PATH environment variable.
