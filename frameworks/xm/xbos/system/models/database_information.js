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
  applicationBinding: SC.Binding.from('*settings.Application').noDelay(),

  /**
    @type Boolean
  */
  registrationKeyBinding: SC.Binding.from('*settings.RegistrationKey').noDelay(),

  /**
    @type String
  */
  databaseNameBinding: SC.Binding.from('*settings.DatabaseName').noDelay(),
  
  /**
    @type String
  */
  databaseCommentsBinding: SC.Binding.from('*settings.DatabaseComments').noDelay(),
  
  /**
    @type Number
  */
  serverVersionBinding: SC.Binding.from('*settings.ServerVersion').noDelay(),

  /**
    @type Boolean
  */
  serverPatchVersionBinding: SC.Binding.from('*settings.ServerPatchVersion').noDelay(),

  /**
    @type Boolean
  */  
  isNotAallowMismatchClientVersionBinding: SC.Binding.from('*settings.DisallowMismatchClientVersion').noDelay(),

  /**
    @type Boolean
  */  
  isForceLicenseLimitBinding: SC.Binding.from('*settings.ForceLicenseLimit').noDelay(),
  
  /**
    @type String
  */
  allowedUserLoginsBinding: SC.Binding.from('*settings.AllowedUserLogins').noDelay()
  
}) ;

XM.databaseInformation = XM.DatabaseInformation.create();


