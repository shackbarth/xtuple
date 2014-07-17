/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global SYS:true, XM:true, Backbone:true, _:true, X: true */

(function () {
  "use strict";

  var async = require("async");

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.ClientCodeRelation = XM.SimpleModel.extend({

    recordType: 'SYS.ClientCodeRelation'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.ClientCode = XM.SimpleModel.extend({

    recordType: 'SYS.ClientCode'

  });

  SYS.CustomerEmailProfile = XM.SimpleModel.extend({
    recordType: 'SYS.CustomerEmailProfile'
  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.Extension = XM.SimpleModel.extend({
    recordType: 'SYS.Extension'
  });

  SYS.File = XM.SimpleModel.extend({
    recordType: 'SYS.File'
  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.Oauth2client = XM.SimpleModel.extend({

    recordType: 'SYS.Oauth2client'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.Oauth2clientRedirs = XM.SimpleModel.extend({

    recordType: 'SYS.Oauth2clientRedirs'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.Oauth2token = XM.SimpleModel.extend({

    recordType: 'SYS.Oauth2token'

  });

  SYS.ReportDefinition = XM.SimpleModel.extend({
    recordType: 'SYS.ReportDefinition'
  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.SessionStore = XM.SimpleModel.extend({
    /** @scope SYS.SessionStore.prototype */

    recordType: 'SYS.SessionStore',

    idAttribute: 'id',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.User = XM.SimpleModel.extend({
    /** @scope SYS.User.prototype */

    recordType: 'SYS.User',

    /**
      Checks for a user privilege. Also checks all the roles that the user is a part of.
      Necessarily async because not all the relevant data is nested.
      Not portable to the client because of the backbone-relational-lessness
      of the models.
      `callback(err, result)` where result is truthy iff the user has the privilege
    */
    checkPrivilege: function (privName, database, callback) {
      var privCheck = _.find(this.get("grantedPrivileges"), function (model) {
        return model.privilege === privName;
      });
      if (privCheck) {
        callback(); // the user has this privilege!
        return;
      }
      // this gets a little dicey: check all the user's roles for the priv, which
      // requires async.map
      var roles = _.map(this.get("grantedUserAccountRoles"), function (grantedRole) {
        return grantedRole.userAccountRole;
      });
      var checkRole = function (roleName, next) {
        var role = new SYS.UserAccountRole();
        role.fetch({
          id: roleName,
          username: X.options.databaseServer.user,
          database: database,
          success: function (roleModel, results) {
            var rolePriv = _.find(roleModel.get("grantedPrivileges"), function (grantedPriv) {
              return grantedPriv.privilege === privName;
            });
            next(null, rolePriv);
          }
        });
      };
      async.map(roles, checkRole, function (err, results) {
        // if any of the roles give the priv, then the user has the priv
        var result = _.reduce(results, function (memo, priv) {
          return priv || memo;
        }, false);
        console.log(result);
        if (err || !result) {
          callback({message: "_insufficientPrivileges"});
          return;
        }
        callback(); // success!
      });
    }
  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.UserAccountRole = XM.SimpleModel.extend({
    /** @scope SYS.UserAccountRole.prototype */

    recordType: 'SYS.UserAccountRole'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.CreditCard = XM.SimpleModel.extend(/** @lends SYS.CreditCard.prototype */{

    recordType: 'SYS.CreditCard',

    idAttribute: 'uuid'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.CreditCardPayment = XM.SimpleModel.extend(/** @lends SYS.CreditCardPayment.prototype */{

    recordType: 'SYS.CreditCardPayment',

    idAttribute: "id",

    autoFetchId: true

  });

  _.extend(SYS.CreditCardPayment, {

    AUTHORIZED: "A",

    CAPTURE: "C",

    CHARGED: "C",

    CREDIT: "R",

    DECLINED: "D",

    ERROR: "X",

    REVERSE: "V",

    VOID: "V"

  });


  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.SalesOrderPayment = XM.SimpleModel.extend(/** @lends SYS.SalesOrderPayment.prototype */{

    recordType: 'SYS.SalesOrderPayment',

    idAttribute: "uuid"

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.Recover = XM.SimpleModel.extend(/** @lends SYS.Recover.prototype */{

    recordType: 'SYS.Recover',

    idAttribute: 'id'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  SYS.ClientCodeRelationCollection = XM.Collection.extend({

    model: SYS.ClientCodeRelation

  });

  /**
    @class

    @extends XM.Collection
  */
  SYS.Oauth2clientCollection = XM.Collection.extend({

    model: SYS.Oauth2client

  });

  /**
    @class

    @extends XM.Collection
  */
  SYS.Oauth2clientRedirsCollection = XM.Collection.extend({

    model: SYS.Oauth2clientRedirs

  });
  /**
    @class

    @extends XM.Collection
  */
  SYS.Oauth2tokenCollection = XM.Collection.extend({

    model: SYS.Oauth2token

  });

  SYS.ExtensionCollection = XM.Collection.extend({
    model: SYS.Extension
  });

  SYS.FileCollection = XM.Collection.extend({
    model: SYS.File
  });

  /**
    @class

    @extends XM.Collection
  */
  SYS.UserCollection = XM.Collection.extend({
    /** @scope SYS.UserCollection.prototype */

    model: SYS.User

  });

  /**
    @class

    @extends XM.Collection
  */
  SYS.RecoverCollection = XM.Collection.extend({
    /** @scope SYS.RecoverCollection.prototype */

    model: SYS.Recover

  });

  SYS.ReportDefinitionCollection = XM.Collection.extend({

    model: SYS.ReportDefinition

  });
}());
