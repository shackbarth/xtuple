# XT

> A Node.js framework to supply a friendly OO-ish style object hierarchy with events and many
> helper features and tools. Currently built to support use with [MongoDB](http://github.com/mongodb/mongo), 
> [Mongoose](http://github.com/LearnBoost/mongoose), [PostgreSQL](http://www.postgresql.org/) and servers
> that support routing with encapsulated route-handlers, support WebSockets and REST as well as 
> [Connect](http://github.com/senchalabs/connect/) and much more.

### Dependencies

* [node](http://github.com/joyent/node) -- 0.6.9

> Documentation needs to be completed, sorry!

#### Here's a quick, pointless example using the framework
###### For a more complete example, check out [node-datasource](http://github.com/xtuple/node-datasource.git) or [node-router](http://github.com/xtuple/node-router.git)

```javascript
#!/usr/bin/env node

(function () {
  "use strict";

  require("xt");
  
  // make sure to include the server framework and autostart
  // the foundation to init any bootstrap functionality or
  // cleanup routines
  XT.setup({requireServer: true, autoStart: true});
  
  var router, route;
  
  // here we create the encapsulated, fully event-ed route/handler
  route = XT.Route.create({
    handle: function (xtr) {
      // the `xtr` object is a special response object that normalizes
      // interaction of handlers with WebSockets and REST requests
      // seamlessly
      var requestPath = xtr.get("path");
      xtr.write("You requested %@ from me!".f(requestPath)).close();
    },
    handles: "*".w() // an array of paths to accept, could be space separated paths
  });
  
  // here we create the encapsulated, reusable (between servers) router
  router = XT.Router.create({routes: [route]});
  
  // could also have used XT.Server.extend and later called `create` on
  // the new class
  XT.Server.create({
    name: "Test Server",
    router: router,
    port: 2020,
    autoStart: true,
    init: function () {
      // example of being able to call super methods
      // in strict mode
      XT.debug("Hi, I'm overloading the XT.Server init routine!");
      this._super.init.call(this);
    }
  });
}());
```

##### Author

W. Cole Davis