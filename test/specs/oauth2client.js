/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  /**
    A client for the REST server
    @class
    @alias Oauth2client
  */
  var spec = {
    recordType: "XM.Oauth2client",
    collectionType: "XM.Oauth2clientCollection",
    /**
      @member -
      @memberof Oauth2client
      @description The oauth2client collection is not cached.
    */
    cacheName: null,
    listKind: "XV.Oauth2clientList",
    instanceOf: "XM.Model",
    /**
      @member -
      @memberof Oauth2client
      @description Oauth2clients are not lockable.
    */
    isLockable: false,
    /**
      @member -
      @memberof Oauth2client
      @description The ID attribute is "id"
    */
    idAttribute: "id",
    enforceUpperKey: false,
    attributes: ["clientID", "clientSecret", "clientName", "clientEmail", "clientType"],
    /**
      @member -
      @memberof Honorific.prototype
      @description Used in the crm and project modules
    */
    extensions: ["oauth2"],
    /**
      @member -
      @memberof Honorific.prototype
      @description Honorifics can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainTitles" privilege.
    */
    privileges: {
      createReadUpdateDelete: "MaintainOauth2clients",
      read: true
    },
    skipCrud: true, // TODO: need to grant the priv to admin
    skipSmoke: true, // TODO
    createHash: {
      clientID: "my_id_" + Math.random(),
      clientSecret: "mostlysecret",
      clientName: "Snowden",
      clientEmail: "client@oau.th",
      clientType: "web server"
    },
    updatableField: "clientSecret"
  };

  exports.spec = spec;

}());
