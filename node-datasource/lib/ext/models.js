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
  XM.DatabaseServer = XM.SimpleModel.extend({
    /** @scope XM.DatabaseServer.prototype */

    recordType: 'XM.DatabaseServer',

    idAttribute: 'name',

    databaseType: 'global',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Datasource = XM.SimpleModel.extend({
    /** @scope XM.Datasource.prototype */

    recordType: 'XM.Datasource',

    idAttribute: 'name',

    databaseType: 'global',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Extension = XM.SimpleModel.extend({
    /** @scope XM.Extension.prototype */

    recordType: 'XM.Extension',

    databaseType: 'global'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Oauth2client = XM.SimpleModel.extend({
    /** @scope XM.Organization.prototype */

    recordType: 'XM.Oauth2client',

    databaseType: 'global'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Oauth2clientRedirs = XM.SimpleModel.extend({
    /** @scope XM.Organization.prototype */

    recordType: 'XM.Oauth2clientRedirs',

    databaseType: 'global'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Oauth2token = XM.SimpleModel.extend({
    /** @scope XM.Organization.prototype */

    recordType: 'XM.Oauth2token',

    databaseType: 'global'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Organization = XM.SimpleModel.extend({
    /** @scope XM.Organization.prototype */

    recordType: 'XM.Organization',

    idAttribute: 'name',

    databaseType: 'global',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.OrganizationExtension = XM.SimpleModel.extend({
    /** @scope XM.OrganizationExtension.prototype */

    recordType: 'XM.OrganizationExtension',

    databaseType: 'global'

  });


  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Session = XM.SimpleModel.extend({
    /** @scope XM.Session.prototype */

    recordType: 'XM.Session',

    idAttribute: 'sid',

    databaseType: 'global',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.SessionOrganization = XM.SimpleModel.extend({
    /** @scope XM.SessionOrganization.prototype */

    recordType: 'XM.SessionOrganization',

    databaseType: 'global'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.SessionStore = XM.SimpleModel.extend({
    /** @scope XM.SessionStore.prototype */

    recordType: 'XM.SessionStore',

    idAttribute: 'id',

    databaseType: 'global',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.User = XM.SimpleModel.extend({
    /** @scope XM.User.prototype */

    recordType: 'XM.User',

    autoFetchId: false,

    databaseType: 'global'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.UserOrganization = XM.SimpleModel.extend({
    /** @scope XM.UserOrganization.prototype */

    recordType: 'XM.UserOrganization',

    databaseType: 'global'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.GlobalPrivilege = XM.SimpleModel.extend(/** @lends XM.GlobalPrivilege.prototype */{

    recordType: 'XM.GlobalPrivilege',

    databaseType: 'global'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.UserGlobalPrivilegeAssignment = XM.SimpleModel.extend(/** @lends XM.UserGlobalPrivilegeAssignment.prototype */{

    recordType: 'XM.UserGlobalPrivilegeAssignment',

    databaseType: 'global'

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
  XM.DatabaseServerCollection = XM.Collection.extend({
    /** @scope XM.DatabaseServerCollection.prototype */

    model: XM.DatabaseServer

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.DatasourceCollection = XM.Collection.extend({
    /** @scope XM.DatasourceCollection.prototype */

    model: XM.DatabaseServer
  });

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
  XM.OrganizationCollection = XM.Collection.extend({
    /** @scope XM.OrganizationCollection.prototype */

    model: XM.Organization

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.UserOrganizationCollection = XM.Collection.extend({
    /** @scope XM.UserOrganizationCollection.prototype */

    model: XM.UserOrganization

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SessionCollection = XM.Collection.extend({
    /** @scope XM.SessionCollection.prototype */

    model: XM.Session

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SessionStoreCollection = XM.Collection.extend({
    /** @scope XM.SessionStoreCollection.prototype */

    model: XM.SessionStore

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
