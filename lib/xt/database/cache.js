/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var _path = require("path");

  var _ = XT._;
  var mongoose = XT.mongoose;

  XT.cache = XT.Object.extend({
    /** @lends XT.cache */

    init: function () {
      this.connection = mongoose.createConnection(this.get("conString"));
      var schemaFiles = this.get("schemaFiles");
      var idx;

      if (!schemaFiles || schemaFiles.length <= 0) {
        XT.warn("no mongo schemas available!");
      } else {
        for (idx = 0; idx < schemaFiles.length; ++idx) {
          require(schemaFiles[idx]);
        }
      }

      // catch SIGINT to close connection but don't
      // run it multiple times
      process.once("SIGINT", _.bind(this.cleanup, this));
    },

    conString: function () {
      return "mongodb://localhost/xttestdb";
    }.property(),

    cleanup: function () {
      if (this.connection) {
        this.connection.close();
      }
    },
    
    connection: null,
    
    model: function (name) {
      var schemas = this.get("schemas"), schema = "%@Schema".f(name),
          models = this.get("models"), con = this.get("connection"), K;
      if (!models[schema]) {
        K = models[schema] = models[name] = con.model(name, schemas[schema]);
      } else { K = models[schema]; }
      return K;
    },

    models: function () {
      return XT.models || (XT.models = {});
    }.property(),

    schemas: function () {
      return XT.schemas || (XT.schemas = {});
    }.property(),

    schemaFiles: function () {
      if (this._schemaFiles) {
        return this._schemaFiles;
      }
      var dir = _path.join(XT.basePath, XT.opts.mongo.schemas);
      var schemaFiles = this._schemaFiles = XT.directoryFiles(dir, { extension: "js", fullPath: true });
      return schemaFiles;
    }.property()
  });
  
  XT.mixin(XT.cache, {
    _create: XT.cache.create,
    create: function () {
      var K = this;
      return (XT.cache = K._create());
    }
  });
  
}());
