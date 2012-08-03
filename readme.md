# Datasource

> A Node.js web service designed for deployment in a cloud environment and one piece
> of the Postbooks cloud technology stack. Exposes both a REST and WebSocket API for
> clients, serves the client and authentication source, manages user authentication,
> communication with the databases (MongoDB and Postgres), session control and more.

### Dependencies

* [node](http://github.com/joyent/node) -- 0.6.9
* [node-xt](http://github.com/xtuple/node-xt) -- master (npm dependency)
* [node-schemas](http://github.com/xtuple/node-schemas) -- (embedded submodule)
* [client](http://github.com/xtuple/client) -- master

###### Special Note

> While production deployment strategies will separate the components in many ways,
> the route followed in these instructions is for development and assumes a single
> server for all web service components in the stack. This is especially important
> to note in terms of the [client](http://github.com/xtuple/client) as various
> interfaces require pieces of its code base but will need to execute separately
> moving forward.