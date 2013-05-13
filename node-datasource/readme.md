# Datasource

> A Node.js web service designed for deployment in a cloud environment and one piece
> of the Postbooks cloud technology stack. Exposes both a REST and WebSocket API for
> clients, serves the client and authentication source, manages user authentication,
> communication with the postgres databases, session control and more.

All of the configuration options for the datasource are in the `config.js` file (modified by you) 
or in any other configuration file and specified by the `-c` flag from the command-line at command 
invocation. You will typically want to copy the sample_config.js file to config.js and 
update any fields that are specific to your implementation.

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

The datasource now needs a private key and signed certificate 
to be able to provide SSL (_https_) encryption. It is beyond the scope of these instructions to direct on how 
to generate a self-signed certificate for development. Note that once these have been generated they, by 
convention, should be placed in the `lib/private` directory but can be placed anywhere in the project directory 
with their paths specified in the `config.js` file. 

The files that _need_ to be generated/modified as necessary are:
* `config.js` for configuring the datasource
* `lib/private/key.pem` (or other path/name as specified by you)
* `lib/private/cert.crt` (or other path/name as specified by you)
* `lib/private/salt.txt` (or other path/name as specified by you)

### Hints

1. The [node-datasource](http://github.com/xtuple/node-datasource) uses port 80 and 443; if there is another web server running (e.g. apache) then it needs to be stopped and if this machine is one you would like to frequently run the datasource from you might consider removing apache from an automatic startup routine if it has one. Consult your operating system documentation for details on how to do this. Also note that these ports require elevated credentials to bind thus the `sudo` in the command for non-root users starting the service.
