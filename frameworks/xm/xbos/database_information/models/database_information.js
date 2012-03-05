// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('mixins/settings');

/** @class

  (Document your Model here)

  @extends XM.Object
  @version 0.1
*/

XM.DatabaseInformation = XM.Object.extend( XM.Settings,
/** @scope XM.DatabaseInformation.prototype */ {

  className: 'XM.DatabaseInformation',
  
  privilege: 'ConfigDatabaseInfo',

  /**
    @type Number
  */  
  applicationBinding: '*settings.Application',

  /**
    @type Boolean
  */
  registrationKeyBinding: '*settings.RegistrationKey',

  /**
    @type String
  */
  databaseNameBinding: '*settings.DatabaseName',
  
  /**
    @type String
  */
  databaseCommentsBinding: '*settings.DatabaseComments',
  
  /**
    @type Number
  */
  serverVersionBinding: '*settings.ServerVersion',

  /**
    @type Boolean
  */
  serverPatchVersionBinding: '*settings.ServerPatchVersion',

  /**
    @type Boolean
  */  
  isNotAallowMismatchClientVersionBinding: '*settings.DisallowMismatchClientVersion',

  /**
    @type Boolean
  */  
  isForceLicenseLimitBinding: '*settings.ForceLicenseLimit',
  
  /**
    @type String
  */
  allowedUserLoginsBinding: '*settings.AllowedUserLogins'
  
}) ;

XM.databaseInformation = XM.DatabaseInformation.create();


