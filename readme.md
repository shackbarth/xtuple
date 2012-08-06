# Datasource

> A Node.js web service designed for deployment in a cloud environment and one piece
> of the Postbooks cloud technology stack. Exposes both a REST and WebSocket API for
> clients, serves the client and authentication source, manages user authentication,
> communication with the databases (MongoDB and Postgres), session control and more.

### Dependencies

* [node](http://github.com/joyent/node) -- 0.6.9
* [mongodb](http://github.com/mongodb/mongo) -- 2.1.2
* [node-xt](http://github.com/xtuple/node-xt) -- master (npm dependency)
* [node-schemas](http://github.com/xtuple/node-schemas) -- (embedded submodule)
* [client](http://github.com/xtuple/client) -- master
* [login](http://github.com/xtuple/login) -- master

###### Special Note

> While production deployment strategies will separate the components in many ways,
> the route followed in these instructions is for development and assumes a single
> server for all web service components in the stack. This is especially important
> to note in terms of the [client](http://github.com/xtuple/client) as various
> interfaces require pieces of its code base but will need to execute separately
> moving forward.

### Setup

___If you have already followed the directions for [node-router](http://github.com/xtuple/node-router) 
then [node-xt](http://github.com/xtuple/node-xt) and [client](http://github.com/xtuple/client) 
are already available in the correct location and you do not need to clone them again.___

Once [node](http://github.com/joyent/node) has been setup and is available to your
environment, ensure that you have cloned [node-xt](http://github.com/xtuple/node-xt) and 
[client](http://github.com/xtuple/client) alongside the [node-datasource](http://github.com/xtuple/node-datasource) repository.  

For all of the [node](http://github.com/joyent/node) layer components in the stack they
require the [node-xt](http://github.com/xtuple/node-xt) framework as a dependency. It is
possible to, from the project root, execute `npm install` and have it clone another copy
for you. Rather than do this, from the root of the [node-datasource](http://github.com/xtuple/node-datasource) repository, `mkdir node_modules`. Then `cd node_modules` and `ln -s ../../node-xt ./xt`. This way, the local pieces will be sharing the
[node-xt](http://github.com/xtuple/node-xt) installation. If you have not already done so, make sure to execute `npm install` from within the [node-xt](http://github.com/xtuple/node-xt) project root, if you have already setup [node-router](http://github.com/xtuple/node-router) you will have already done this. From the [node-datasource](http://github.com/xtuple/node-datasource) project root, you need to initialize the embedded [node-schemas](http://github.com/xtuple/node-schemas) submodule with `git submodule update --init`.

All of the configuration options for the [node-datasource](http://github.com/xtuple/node-datasource) are in the `config.js` file (modified by you) or in any other configuration file and specified by the `-c` flag from the command-line at command invocation. It is recommended that a copy of the `config.js` file be made (e.g. `config_local.js`) so that subsequent pulls will not discard your changes to the file. Most likely you will only need to modify the portion of the configuration that deals with the server key/certificate/salt files, possibly the proxy service if you are running that from a different server or network interface.

```javascript
// from config.js
datasource: {
  sessionTimeout: 15,
  securePort: 443,
  secureKeyFile: "./lib/private/key.pem",
  secureCertFile: "./lib/private/cert.crt",
  secureSaltFile: "./lib/private/salt.txt"
}
```

```javascript
// from config.js
proxy: {
  hostname: "localhost",
  port: 9000
}
```

The [node-datasource](http://github.com/xtuple/node-datasource) now needs a private key and signed certificate to be able to provide SSL (_https_) encryption. It is beyond the scope of these instructions to direct on how to generate a self-signed certificate for development. Note that once these have been generated they, by convention, should be placed in the `lib/private` directory but can be placed anywhere in the project directory with their paths specified in the `config.js` or `config_local.js` file. 

So, a complete list of the executed commands are as follows:

```bash
git clone git@github.com:xtuple/node-xt.git
git clone git@github.com:xtuple/node-datasource.git
git clone git@github.com:xtuple/client.git
git clone git@github.com:xtuple/login.git
cd node-xt
npm install
cd ../node-datasource
mkdir node_modules
cd node_modules
ln -s ../../node-xt ./xt
cd ..
git submodule update --init
```

The files that _need_ to be generated/modified as necessary are:
* `config.js` or `config_local.js` for configuring the datasource to find the correct files
* `lib/private/key.pem` (or other path/name as specified by you)
* `lib/private/cert.crt` (or other path/name as specified by you)
* `lib/private/salt.txt` (or other path/name as specified by you)

##### Special Note

> An ugly fault of the current configuration is the way the salt is shared. Out of the box the [node-router](http://github.com/xtuple/node-router) defaults to looking at `../node-datasource/lib/private/salt.txt` unless otherwise specified _in it's own configuration_. This will be changed in the future. The salt ___must be the same___ or authentication cannot be consistent between them. If the salt is changed after users have been created (see [node-router](http://github.com/xtuple/node-router) documentation) their passwords will ___have___ to be updated or they cannot log in to the system.

##### Special Note

> If you have not already followed the setup directions for [client](http://github.com/xtuple/client) you need to do that now. If you have not setup 
[node-router](http://github.com/xtuple/node-router) you need to do that before the
system will be very useful.

At this point the [node-datasource](http://github.com/xtuple/node-datasource) should be ready to
run with the command `sudo node main.js -c config_local.js` (as non-root user). Make sure to read the hints section on several other environment issues that may interfere with the running process. Also keep in mind that the [node-datasource](http://github.com/xtuple/node-datasource) is fairly useless without the other components of the stack as it requires access to an active MongoDB instance, PostgreSQL instance, and [node-router](http://github.com/xtuple/node-router) instance alongside the current (and setup) [client](http://github.com/xtuple/client).

### Hints

1. The [node-datasource](http://github.com/xtuple/node-datasource) uses port 80 and 443; if there is another web server running (e.g. apache) then it needs to be stopped and if this machine is one you would like to frequently run the datasource from you might consider removing apache from an automatic startup routine if it has one. Consult your operating system documentation for details on how to do this. Also note that these ports require elevated credentials to bind thus the `sudo` in the command for non-root users starting the service.
2. There is a configuration file `config.js` that has a lot of configuration options that need to be set. Included in the repo is a `config_local.js` file that has the most commonly set options ready to use. Make sure that paths are all set properly for your configuration and file locations. All paths (___ALL PATHS___) are relative to the current working directory from where the service was started. Consider that there is a convention to place key/cert/salt files in the `lib/private` directory. 