/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Extension = XM.SimpleModel.extend({
    /** @scope XM.Extension.prototype */

    recordType: 'XM.Extension'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Oauth2client = XM.SimpleModel.extend({
    /** @scope XM.Organization.prototype */

    recordType: 'XM.Oauth2client'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Oauth2clientRedirs = XM.SimpleModel.extend({
    /** @scope XM.Organization.prototype */

    recordType: 'XM.Oauth2clientRedirs'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Oauth2token = XM.SimpleModel.extend({
    /** @scope XM.Organization.prototype */

    recordType: 'XM.Oauth2token'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Organization = XM.SimpleModel.extend({
    /** @scope XM.Organization.prototype */

    recordType: 'XM.Organization',

    idAttribute: 'name',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.OrganizationExtension = XM.SimpleModel.extend({
    /** @scope XM.OrganizationExtension.prototype */

    recordType: 'XM.OrganizationExtension'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.SessionStore = XM.SimpleModel.extend({
    /** @scope XM.SessionStore.prototype */

    recordType: 'XM.SessionStore',

    idAttribute: 'id',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.User = XM.SimpleModel.extend({
    /** @scope XM.User.prototype */

    recordType: 'XM.UserAccount'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.UserOrganization = XM.SimpleModel.extend({
    /** @scope XM.UserOrganization.prototype */

    recordType: 'XM.UserOrganization'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.BiCache = XM.SimpleModel.extend(/** @lends XM.BiCache.prototype */{

    recordType: 'XM.BiCache',

    databaseType: 'global',

    idAttribute: 'key'

  });


  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.Oauth2clientCollection = XM.Collection.extend({
    /** @scope XM.OrganizationCollection.prototype */

    model: XM.Oauth2client

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.Oauth2clientRedirsCollection = XM.Collection.extend({
    /** @scope XM.OrganizationCollection.prototype */

    model: XM.Oauth2clientRedirs

  });
  /**
    @class

    @extends XM.Collection
  */
  XM.Oauth2tokenCollection = XM.Collection.extend({
    /** @scope XM.OrganizationCollection.prototype */

    model: XM.Oauth2token

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ExtensionCollection = XM.Collection.extend(/** @lends XM.ExtensionCollection.prototype */{

    model: XM.Extension

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.UserCollection = XM.Collection.extend({
    /** @scope XM.UserCollection.prototype */

    model: XM.User

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.BiCacheCollection = XM.Collection.extend({
    /** @scope XM.BiCacheCollection.prototype */

    model: XM.BiCache

  });
}());
