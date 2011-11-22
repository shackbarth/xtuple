
/*globals XT */

sc_require("mixins/logging");

/** @namespace

  This is the default datasource object definition. It is based
  on the SC datasource object and has its own implementation of
  many methods that needed implementations specific to our needs.  

  @todo All of the below code needs review as it was taken
     directly from the previous version of the application
     in an attempt to save time.

*/
XT.DataSource = SC.DataSource.create(XT.Logging, 
  /** @scope XT.DataSource.prototype */ {

  serverIsAvailable: NO,

  serverIsAvailableTooltip: function() {
    var iv = this.get("serverIsAvailable");
    if(iv) return "_serverAvailable".loc();
    else return "_serverUnavailable".loc();
  }.property("serverIsAvailable"),

  // ..........................................................
  // QUERY SUPPORT
  //

  fetch: function(store, query) {
    var name = XT.DataSource.nameFromQuery(query);
    if(name === false) return NO;

    if(SC.kindOf(query.recordType, XM.Metasql)) {
      var metasqlGroup = query.getPath('recordType.prototype.metasqlGroup');
      var metasqlName = query.getPath('recordType.prototype.metasqlName');
      var name = XT.DataSource.nameFromQuery(query);
      if(metasqlGroup === null || metasqlName === null) return NO;
      SC.Request.postUrl(XT.DataSource.buildURL("metasql",
                                                metasqlGroup, metasqlName))
        .header({'Accept': 'application/json'}).json()
        .notify(this, 'didFetchMql', store, query, name)
        .send(query.parameters);
      return YES;
    }

    // Let's just NEVER fetch anything run through a query asking
    // for conditions unless it's metasql
    if(query.get('conditions') !== null) return NO;

    // console.log("XT.Store.fetch");
    // console.log(query);

    SC.Request.getUrl(XT.DataSource.buildURL(query))
      .header({'Accept': 'application/json'}).json()
      .notify(this, 'didFetchData', store, query, name)
      .send();

    return YES;
  },

  didFetchMql: function(response, store, query, name) {

    if(SC.ok(response)) {
      var data = response.get('body'),
          recordTypeStr,
          recordType,
          storeKeys;
      for (recordTypeStr in data) {
        if (data.hasOwnProperty(recordTypeStr)) {
          if (recordTypeStr == 'content') {     // used by metasql
            storeKeys = store.loadRecords(XT.DataSource.typeFromName(name),
                                          data.content);
          } else if (recordTypeStr === 'affected_rows') continue;
          // assignment here vvv, not equality check: if typeFromName succeeded
          else if (recordType = XT.DataSource.typeFromName(recordTypeStr)) {
            storeKeys = store.loadRecords(recordType, data[recordTypeStr]);
          } else {
            console.log("didFetchData() found %@: %@"
                        .fmt(recordTypeStr, data[recordTypeStr]));
          }
        }
      }
      if (query.isRemote()) store.loadQueryResults(query, storeKeys);
      store.dataSourceDidFetchQuery(query);
    }
    else {
      store.dataSourceDidErrorQuery(query, response);
      // window.alert('Bad response from server');
      console.log('Bad response from server');
    }
  },

  didFetchData: function(response, store, query, name) {
    if(SC.ok(response)) {
      // store.applyChangeset(response.get('body'));
      // console.log("didFetchData %@".fmt(name));
      var body = response.get("body");
      // console.log(body);
      body.sc_types.forEach(function(recordTypeName) {
        // console.log(recordTypeName);
        // console.log(body[ recordTypeName ]);
        body[ recordTypeName ].forEach(function(row) {
        //   console.log("trying pushRetrieve");
        //   console.log(row);
          store.pushRetrieve(XT.DataSource.typeFromName(recordTypeName), row.guid, row);
        });
      });
    }
    else {
      store.dataSourceDidErrorQuery(query, response);
      // window.alert('Bad response from server');
      console.log('Bad response from server');
    }
  },

  // ..........................................................
  // RECORD SUPPORT
  //

  retrieveRecord: function(store, storeKey) {
    // var name = XT.DataSource.nameFromType(store.recordTypeFor(storeKey));
    // if (name === false)
    //   return NO;

    var guid = store.idFor(storeKey);
    var type = store.recordTypeFor(storeKey).toString();
    var name = type.toString();
    var json = {};

    // console.log("RETRIEVING RECORD FOR: %@".fmt(name));

    json[ name ] = { guid: guid };

    // json = JSON.stringify(json);

    // console.log("JSON PAYLOAD: %@".fmt(json));

    SC.Request.putUrl(XT.DataSource.buildURL(store.recordTypeFor(storeKey)))
      .header({ 'Accept': 'application/json' }).json()
      .notify(this, 'didRetrieveData', store, storeKey)
      .send(json);

    return YES;
  },

  didRetrieveData: function(response, store, storeKey) {
    if(SC.ok(response)) {
      var body = response.get("body");
      // console.log(body);
      body.sc_types.forEach(function(recordTypeName) {
        store.dataSourceDidComplete(storeKey, body[ recordTypeName ][ 0 ]);
      });

    } else {
      store.dataSourceDidError(storeKey, response);
      // window.alert('Bad response from server');
      console.log('Bad response from server');
    }
  },

  commit: function(store) {

    // build the changeset
    var changeset = JSON.stringify(store.computeChangeset());

    console.log("Changeset for commit:\n");
    console.log(changeset);
    console.log("\n");

    // need to send the name of the functor and the only data it
    // it needs is the contructed changeset
    var json = {
      name: "XT.CommitFunctor",
      changeset: changeset,
    };

    console.log(json);

    // send the request with the payload including the changeset and
    // calling the appropriate functor
    SC.Request.putUrl(
    
      // the URL should just be /retrieve/functor
      XT.DataSource.buildURL("commit")).header(

      // accept json encoded response, jsonify post data
      { "Accept": "application/json" }).json().notify(

      
      // make sure that on asynchronous data response it gets handled
      // by the `didCommitData` method
      this, this.didCommitData, store).send(

      // send the name of the functor it is requesting and
      // the full changeset so the server knows what to commit
      json);
  },

  didCommitData: function(response, store) {

    // determine if the request was successful or not
    var body = response.get("body");

    // if there was an error this value will be set to 1
    if(body.error) {

      // there was an error, what was the code
      var code = body.code;

      // grab the error from errors object
      var error = XT.errors.findProperty("code", code);

      console.warn("Datasource returned error for commit: %@".fmt(code));

      // set the error on the store
      store.set("error", error);
    } else {
      store.commitChanges();
    }

    // either way, we handled it
    return YES;
  },

  pingServer: function() {
    SC.Request.postUrl(XT.DataSource.buildURL("functor"))
      .notify(this, "pingResponse").json()
      .timeoutAfter(150)
      .send({ name: "XT.PingFunctor" });
  },

  pingResponse: function(response) {
    var r = response;
    if(r.timedOut) {
      this.warn("Ping request to server timedout!");
      this.set("serverIsAvailable", NO);
    } else if(r.status !== 200) { this.set("serverIsAvailable", NO); } 
    else { this.set("serverIsAvailable", YES); }
  }

}) ;

/** Given a string value representing a datasource type,
    return the actual XT.DataSource recordType.
    Strings can be of the form [XT.]recordType
    or [XT.]parent[.parent...].recordType.
 */
XT.DataSource.typeFromName = function(name) {
  var nameparts = name.split('.'),
      retval = XM;

  if (nameparts[0] === 'XM') nameparts.shift();
  for (i = 0; i < nameparts.length; i++)
  {
    if (nameparts[i] in retval) {
      retval = retval[nameparts[i]];
    } else {
      retval = NO;
      break;
    }
  }

  // console.log("XT.DataSource.typeFromName(%@) returning %@".fmt(name, retval));
  return retval;
}

XT.DataSource.nameFromQuery = function(query) {
  return String(query.recordType.prototype.className).replace(/^XM\./, "");
}

XT.DataSource.nameFromType = function(type) {
  return String(type.prototype.className).replace(/^XM\./, "").toLowerCase();
}

/**
  Builds and returns a URL (string) for the appropriate request to the datasource.
  It uses the the data-type and additional arguments to determine what the request
  type is and which of the URL builder handlers to use. Currently it accepts
  parameters in the following forms:

    [ 0 ]: "string"     => "metasql", "runmetasql", "commit", "{recordType}"
    [ 0 ]: "object"     => XT.Record.prototype (uninstances record of type)
    [ 0 ]: "function"   => XT.Record (instanced record of type)

  MetaSQL requests will require additional argument(s).

    [ 1 ]: "string"     => "query", "details", etc.

  Record requests where the first parameter is the XT.Record type in String form CAN
  have additional parameter that will be appended but there is no known use-case for this
  at this time.

*/
XT.DataSource.buildURL = urlCreater;

function urlCreater() {

  // reference to instance
  var self = this;

  /** @private
    Used to create the MetaSQL retrieve URL based on the record being retrieved.
  */
  self.metaSqlHandler = function() {

    // @todo One problem is that these are coming in as different strings but should
    //  be normalized (they are either `metasql` or `runmetasql`?

    // base url for metasql requests
    var url = "/datasource/retrieve/metasql";

    // iterate over arguments and append them to url in order
    for(var i=0; arguments.length > i; ++i) url += "/" + arguments[ i ];

    // return the url string
    return url;
  };

  // handles retrieve requests for records

  /** @private
    Used to create the retrieve URL for record requests (of multiple types).
  */
  self.recordHandler = function() {

    // base url for record requests
    var url = "/datasource/retrieve/content";

    // return the url appended by the classname of the record type
    // very simple case since the actual data is passed through the JSON payload

    // if the arguments are longer than 1 then it is that exception case
    // where the first argument was a string
    if(typeof arguments[ 0 ] === "string") {

      // @note No use-case for this since data is sent via JSON payload
      if(arguments.length > 1) {

        console.warn("DEPRECATED: You should not be building a URL with a record type as a string " +
          "followed by additional arguments");

        // iterate over the arguments and append them to url in order
        for(var i=0; arguments.length > i; ++i) url += "/" + arguments[ i ];
      } else {

        // else its just the name of the record type being requested
        url += "/" + arguments[ 0 ];
      }
    } else {

      // @note The argument was reduced to a form where this could be called in
      //  this manner to retrieve the className not all record-types or forms that
      //  get passed to the urlCreater do this automatically
      url += "/" + arguments[ 0 ].toString();
    }

    // return whichever of the URL's we created
    return url;
  };

  /** @private
    Used to create the record commit URL.
  */
  self.commitHandler = function() {
    
    // simplest case because the changeset is uesd by the server to determine
    // what and how to handle the JSON payload, not the URL
    return "/datasource/commit";
  };


  // here are the simple test-cases to determine which handler to return and
  // what data to send them
  var args = Array.prototype.slice.call(arguments);

  // the first argument is used to derrive the requested URL construction type
  var base = args.shift();

  // first argument is string
  if(typeof base === "string") {

    // if the first argument is one of the elements that determine it to be metasql...

    // @todo Track down whatever is issuing this differently and tar and feather it cause
    //  this is just ... frustrating to have to worry about 2 arbitrary cases for no reason
    if(base == "metasql" || base == "runmetasql") {

      // call the MetaSQL handler
      return self.metaSqlHandler.apply(self, args);
    } else if(base == "commit" || base == "functor") {

      // simplest request type
      return "/datasource/retrieve/functor";
    } else {

      // replace base to the arguments array
      args.unshift(base);

      // it is a request for record data of some type, use record handler
      return self.recordHandler.apply(self, args);
    }
  } else if(typeof base === "function") {

    // if base is a function then it is a record request
    return self.recordHandler.call(self, base);
  } else if(typeof base === "object") {

    // if base is an object then it is also a request for a record type
    return self.recordHandler.call(self, base.get("recordType"));
  } else { throw Error("Could not determine how to create the URL for a request based on `%@`".fmt(base)); }
}

XT.DataSource.start = function start() {
  var ds = XT.DataSource;
  ds.log("Starting up");
  ds.store = XT.Store = XT.Store.create().from("XT.DataSource");
  ds.pingServer();
  return YES;
} ;



