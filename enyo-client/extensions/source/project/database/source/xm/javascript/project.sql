select xt.install_js('XM','ProjectManagement','project', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xtuple.com/CPAL for the full text of the software license. */

  if (!XM.ProjectManagement) { XM.ProjectManagement = {}; }

  XM.ProjectManagement.isDispatchable = true;

  XM.ProjectManagement.options = [
    "UseProjects",
    "RequireProjectAssignment"
  ];

  /*
  Return Project configuration settings.

  @returns {Object}
  */
  XM.ProjectManagement.settings = function() {
    var keys = XM.ProjectManagement.options.slice(0),
        data = Object.create(XT.Data);

    return data.retrieveMetrics(keys);
  };

   /*
  Update Project Management configuration settings. Only valid options as defined in the array
  XM.Project.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.ProjectManagement.commitSettings = function(patches) {
    var sql,
      K = XM.ProjectManagement,
      data = Object.create(XT.Data),
      settings = K.settings(),
      options = K.options.slice(0),
      metrics = {},
      i;

    /* Compose our commit settings by applying the patch to what we already have */
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }

    /* update remaining options as metrics
       first make sure we pass an object that only has valid metric options for this type */
    for (i = 0; i < options.length; i++) {
      var prop = options[i];
      if (settings[prop] !== undefined) { metrics[prop] = settings[prop]; }
    }

    return data.commitMetrics(metrics);
  }

$$ );
