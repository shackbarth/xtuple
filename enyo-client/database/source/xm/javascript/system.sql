select xt.install_js('XM','System','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {
  var systemOptions = [
    "CCLogin",
    "CCPassword",
    "CCCompany",
    "CCTest",
    "CCRequireCCV",
    "DashboardLite",
    "DefaultPriority",
    "RequireProjectAssignment",
    "UseProjects"
  ],
    i, option;

  if (XM.System) {
    for(i = 0; i < systemOptions.length; i++) {
      option = systemOptions[i];
      if(!XM.System.options.contains(option)) {
        XM.System.options.push(option);
      }
    }

  } else {
    XM.System = {};
    XM.System.options = systemOptions;
  }

  XM.System.isDispatchable = true;

  /*
  Return System configuration settings.

  @returns {Object}
  */
  XM.System.settings = function() {
    var keys = XM.System.options.slice(0),
        data = Object.create(XT.Data),
        ret;


    ret = data.retrieveMetrics(keys);

    return ret;
  }

  /*
  Update System configuration settings. Only valid options as defined in the array
  XM.System.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.System.commitSettings = function(patches) {
    var sql, settings, options = XM.System.options.slice(0),
        data = Object.create(XT.Data), metrics = {};

    /* check privileges */
    /* TODO: we can get away with just checking credit card config privs
      because that's the only thing you can do so far */
    if(!data.checkPrivilege('ConfigureCC')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    settings = XM.System.settings();
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }

  /* update options as metrics
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }

    return data.commitMetrics(metrics);
  }

}());

$$ );
