/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global it:true, XT:true, XM:true, XV:true, exports:true, require:true, setTimeout:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    async = require("async"),
    assert = require("chai").assert;

  /**
    Make sure that the attrs of a list or a workspace correspond to the schema
   */
  var verifyAttr = function (attr, recordType, orderByAttribute) {
    var relations = XT.session.schemas.XM.get(XT.String.suffix(recordType)).relations,
      prefix, suffix, relation, cacheName, relatedModelPrototype;

    if (typeof attr === 'object') {
      // TODO: test these compound attrs
      return;
    }

    prefix = XT.String.prefix(attr) || attr;
    relation = _.find(relations, function (rel) {
      return rel.key === prefix;
    });
    if (relation) {
      cacheName = XV.getCache(relation.relatedModel);
    }

    if (attr.indexOf('.') >= 0) {
      // there's a dot in the attribute: we're recursing down another model

      // TODO: we could do more checking if there are two dots

      assert.isDefined(relation, "The " + recordType +
        " schema needs the relation " + prefix);

      if (!cacheName && !relation.isNested) {
        suffix = XT.String.suffix(attr);
        relatedModelPrototype = XM[XT.String.suffix(relation.relatedModel)].prototype;
        assert.equal(typeof relatedModelPrototype[suffix], "function", "The " + recordType +
          " schema needs the relation " + prefix + " to be nested or the model " +
          relation.relatedModel + " needs to be cached, or " + suffix + " needs to be a " +
          "function on " + relation.relatedModel);
      }

      // list-only
      if (orderByAttribute && attr === orderByAttribute && !relation.isNested) {
        assert.fail(1, 0, "The " + recordType +
          " schema needs the relation " + prefix + " to be nested to be used in the list query");
      }

    // list-only
    } else if (orderByAttribute && attr !== orderByAttribute) {
      // there is no dot in the attribute: we're not recursing down another model
      if ((relation && relation.isNested) || cacheName) {
        assert.fail(1, 0, "The nested/cached relation " + prefix +
          " will render unhelpfully as [Object object] in the list without " +
          " specifying a particular field");
      }
    }
  };

  var initializeModel = function (model, Klass, done) {
    var statusChanged = function () {
      if (model.isReady()) {
        model.off("statusChange", statusChanged);
        done(null, model);
      }
    };
    model = new Klass();
    model.on("statusChange", statusChanged);
    model.initialize(null, {isNew: true});
  };

  var fetchModel = function (model, Klass, hash, done) {
    var statusChanged = function () {
      if (model.isReady()) {
        model.off("statusChange", statusChanged);
        done(null, model);
      }
    };
    model = new Klass();
    model.on("statusChange", statusChanged);
    model.fetch(hash);
  };

/*
  under development...

  var prepModel = function (spec, done) {
    if (spec.hash) {
      fetchModel();
    } else {
      initializeModel(null, XM.ProjectType, done);
    }
  };

  var prepModels = function (models, done) {
    var modelsArray = _.map(models, function (value, key) {
      return {key: key, hash: value};
    });

    async.map(modelsArray, prepModel, function (err, results) {
      if (err) {
        done(err);
      }
      _.each(results, function (result) {
        models[result.key] = result.model;
      });
      done();
    });
  };
    */

  exports.initializeModel = initializeModel;
  exports.fetchModel = fetchModel;
  exports.verifyAttr = verifyAttr;

}());
