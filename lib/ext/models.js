/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Model
  */
  XM.DatabaseServer = XM.Model.extend({
    /** @scope XM.DatabaseServer.prototype */

    recordType: 'XM.DatabaseServer',

    idAttribute: 'name'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.Datasource = XM.Model.extend({
    /** @scope XM.Datasource.prototype */

    recordType: 'XM.Datasource',

    idAttribute: 'name'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.Organization = XM.Model.extend({
    /** @scope XM.Organization.prototype */

    recordType: 'XM.Organization',

    idAttribute: 'name'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.Session = XM.Model.extend({
    /** @scope XM.Session.prototype */

    recordType: 'XM.Session'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserOrganization = XM.Model.extend({
    /** @scope XM.UserOrganization.prototype */

    recordType: 'XM.UserOrganization'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.User = XM.Model.extend({
    /** @scope XM.User.prototype */

    recordType: 'XM.User',
    
    relations: [{
      key: "organizations",
      relatedModel: "XM.UserOrganization",
      type: Backbone.HasMany,
      isNested: true,
      reverseRelation: {
        key: "user"
      }
    }]

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
  XM.OrganizationCollection = XM.Collection.extend({
    /** @scope XM.OrganizationCollection.prototype */

    model: XM.Organization

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SessionCollection = XM.Collection.extend({
    /** @scope XM.SessionCollection.prototype */

    model: XM.Session

  });

}());
