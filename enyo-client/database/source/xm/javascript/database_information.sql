select xt.install_js('XM','DatabaseInformation','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.DatabaseInformation = {};

  XM.DatabaseInformation.isDispatchable = true,

  XM.DatabaseInformation.options = [
    "DatabaseName",
    "DatabaseComments",
    "ServerVersion"
  ]

  /* 
  Return DatabaseInfo configuration settings.

  @returns {Object}
  */
  XM.DatabaseInformation.settings = function() {
    var keys = XM.DatabaseInformation.options.slice(0),
      data = Object.create(XT.Data);
    
    return JSON.stringify(data.retrieveMetrics(keys));
  }

  /* 
  Update DatabaseInfo configuration settings. Only valid options as defined in the array
  XM.DatabaseInfo.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.DatabaseInformation.commitSettings = function(settings) {
    var options = XM.DatabaseInformation.options.slice(0),
        data = Object.create(XT.Data), metrics = {};

    /* check privileges */
    if(!data.checkPrivilege('ConfigDatabaseInfo')) throw new Error('Access Denied');

    /* remove read only settings */
    options.remove('Application');
    options.remove('ServerVersion');
    options.remove('ServerPatchVersion');

    /* update remaining options as metrics.
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  }
  
$$ );

