/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global SYS:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

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

    recordType: 'SYS.User'

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
