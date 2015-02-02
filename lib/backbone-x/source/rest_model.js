
(function () {

//
// Our REST server is not currently set up to deal with unhacked backbone.
// I'll enumerate the holes here. I don't mean to be too prescriptive: backbone
// compatibility is not necessary a litmus test for REST excellence. But this
// should shed some light on both our REST server and our backbone implementation.
//

//
// Reads *do* work. I had to do some light hacking into the parse() function,
// as the response value from our REST isn't exactly what backbone expects,
// but this is expected and common, and parse() is deliberately made to bridge
// the gap between these expectations. In particular, the data that backbone
// cares about is in `response.data.data`, instead of just the `response`.
//

//
// Backbone doesn't create the PATCH request in exactly the way we'd expect, so our
// REST server refuses to process it and returns a 404. Typically backbone
// just uses PUT, but since we use PATCH for everything we've yet to implement
// PUT on our REST server. We should really implement this. Backbone's PATCH is very simplistic,
// and there are lots of examples online of integrating Backbone with JSON-PATCH, which
// would probably work with our REST server, but these examples are moderately invasive.
//

//
// Unhacked backbone is incompatible with our system of natural keys, in which
// we hide from the client the DB autonumber ID and make the human-visible and
// typically human-defined key to be the key of the object.
//
// Backbone doesn't expect you to set the idAttribute yourself. If a model
// has an id it's assumed to be already persisted. But we use idAttribute
// for our natural key. So when I go to save a new one it sends a PUT. I don't think
// there's any way to implement our business requirements as well as our natural-key
// client-side system without hacking how this is supposed to work in backbone.
// Typically backbone assumes that the `id` or `idAttribute` field is not something
// that gets set by the client.
//

//
// We expose a pretty large custom API from our model layer to the view layer. Most
// of this is to implement reasonable business requirements of ours, and I'm linking
// to all of the original functions that service this API. Truth be told, a lot of these
// functions still use websockets when communicating to the server, for example to obtain a lock.
//

//
// We're on a two-year old version of backbone and backbone-relational. It's possible to
// run both in parallel using noConflict, but it would be a bit dicey to set up given the
// submodule system we have set up to serve backbone source into our app. I didn't try.
//

//
// An important part of the backbone-relational setup is the way that the models understand
// which other models they have relations with. We smartly reflect this information over to
// the client from our ORM. One problem with our implementation is that the mechanism for
// reflection, the schema dispatch call, is quite database-intensive and accounts for a large
// part of the enyo app load time upon login.
//
// Another problem is that it doesn't use our discovery document, which serves a nearly identical
// purpose for our REST clients. It would be wise to rewrite the backbone-relational
// relation-builder from the discovery document. One thing that's still missing though in the
// discovery document that would be a crippling limitation for implementing this in backbone
// is that the discovery document is universal across all users and doesn't know which fields
// should only be activated by which extensions.
//
// The universality across all users is a good thing; it means it can be cached at the database-
// level which should improve load time. But we should add another field of data onto each
// resource and prop in the discovery doc explaining which extensions drive them. Then, either
// on the server-side or the client-side, we can trim the discovery doc based on the extensions
// the user actually has, and build the backbone-relational relations from that.
//

  "use strict";
  XM.RestModel = Backbone.RelationalModel.extend({
    // instance properties

    //
    // Functions that are copied from XM.Model
    //
    // This is all functionality that we've reasonably built on top
    // of backbone, without stomping on anything. It's all part of the
    // API that enyo expects
    //
    canEdit: function (attr) {
      return XM.Model.prototype.canEdit.apply(this, arguments);
    },

    canUpdate: function () {
      return XM.Model.prototype.canUpdate.apply(this, arguments);
    },

    canView: function () {
      return XM.Model.prototype.canView.apply(this, arguments);
    },

    getAttributeNames: function () {
      return XM.Model.prototype.getAttributeNames.apply(this, arguments);
    },

    getClass: function () {
      return XM.Model.prototype.getClass.apply(this, arguments);
    },

    getLockKey: function (getRoot) {
      return XM.Model.prototype.getLockKey.apply(this, arguments);
    },

    getParent: function (getRoot) {
      return XM.Model.prototype.getParent.apply(this, arguments);
    },

    getValue: function (attr) {
      return XM.Model.prototype.getValue.apply(this, arguments);
    },

    hasLockKey: function () {
      return XM.Model.prototype.hasLockKey.apply(this, arguments);
    },

    isReadOnly: function () {
      return XM.Model.prototype.isReadOnly.apply(this, arguments);
    },

    isRequired: function (attr) {
      return XM.Model.prototype.isRequired.apply(this, arguments);
    },

    revert: function () {
      XM.Model.prototype.revert.apply(this, arguments);
    },

    releaseLock: function () {
      XM.Model.prototype.releaseLock.apply(this, arguments);
    },

    setIfExists: function (value) {
      XM.Model.prototype.setIfExists.apply(this, arguments);
    },

    setValue: function (value) {
      XM.Model.prototype.setValue.apply(this, arguments);
    },

    //
    // Managing status
    //
    // We wrote a status system into backbone that's part of our Sproutcore
    // legacy. It doesn't exactly belong, but we have to honor it for enyo.
    // The one thing that I am changing here is that instead of keeping
    // and manipulating the status as `this.status`, I'm just inferring it
    // from backbone's native lifecycle system.
    //
    getStatus: function () {
      if (this.isNew()) { // isNew() is native to backbone
        return XM.Model.READY_NEW;
      } else if (this.isDirty()) {
        return XM.Model.READY_DIRTY;
      } else {
        return XM.Model.READY_CLEAN;
      }  // TODO: more statuses
    },
    isDirty: function () {
      return _.isObject(this.changedAttributes());
    },
    isReady: function () {
      return true; // TODO
    },
    initialize: function () {
      var that = this;
      // very imperfect
      this.once("change", function () {
        that.trigger("statusChange", that, that.getStatus());
      });
      this.on("change", function () {
        console.log("id change", arguments);
      });
    },
    setStatus: function () {
      // intentionally no-op
    },

    //
    // Backbone-approved stomps
    //
    // Our Google-style REST API doesn't provide the data in the exact way that
    // backbone is used to, but it's real close and the mapping is easy
    //
    // @override
    parse: function (response) {
      if (response.data && response.status) {
        this._lastParse = response.data.data; // our invention, but this will get the copied revert() to work
        return response.data.data;
      }
      this._lastParse = response;
      return response;
    },
    //
    // Describe the location of the REST endpoint
    //
    url: function () {
      // let's keep the concept of recordType, but map the PascalCase to the
      // the armadillo-case that our REST service expects
      var recordType = this.recordType.substring(3);
      var path = XT.String.decamelize(recordType).replace(/_/g, "-");
      return XT.getOrganizationPath() + "/browser-api/v1/resources/" + path + "/" + this.id;
    }


  }, {
    // class properties. Think of these like static methods that hang off the constructor.

    canCreate: XM.ModelClassMixin.canCreate,
    canRead: XM.ModelClassMixin.canRead,
    canUpdate: XM.ModelClassMixin.canUpdate,
    canDelete: XM.ModelClassMixin.canDelete,
    checkCompoundPrivs: XM.ModelClassMixin.checkCompoundPrivs,
    getAttributeNames: XM.Model.getAttributeNames
  });



})();
