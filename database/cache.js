/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _path = X.path, _ = X._, mongoose = X.mongoose;

  X.Cache = X.Object.extend({
    /** @lends X.cache */

    init: function () {
      var schemaFiles, i, prefix = this.get("prefix"), target;

      target = prefix? X.options.cache[prefix]: X.options.cache;

      X.mixin(this, target);

      this.connection = mongoose.createConnection(this.get("conString"));
      schemaFiles = this.get("schemaFiles");

      if (!schemaFiles || schemaFiles.length <= 0) {
        X.warn("no mongo schemas available!");
      } else {
        for (i = 0; i < schemaFiles.length; ++i) {
          require(schemaFiles[i]);
        }
      }

      // catch SIGINT to close connection but don't
      // run it multiple times
      X.addCleanupTask(_.bind(this.cleanup, this));
    },

    conString: function () {
      return "mongodb://%@:%@/%@".f(this.get("hostname"), this.get("port"), this.get("database"));
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
      return X.models || (X.models = {});
    }.property(),

    schemas: function () {
      return X.schemas || (X.schemas = {});
    }.property(),

    schemaFiles: function () {
      var dir, schemaFiles;
      if (this._schemaFiles) {
        return this._schemaFiles;
      }
      dir = _path.join(X.basePath, this.get("schemaDirectory"));
      schemaFiles = this._schemaFiles = X.directoryFiles(dir, {extension: "js", fullPath: true});
      return schemaFiles;
    }.property()
  });
  
}());
