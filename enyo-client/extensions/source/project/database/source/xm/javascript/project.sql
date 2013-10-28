select xt.install_js('XM','Project','project', $$
  /* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
     See www.xtuple.com/CPAL for the full text of the software license. */

  if (!XM.Project) { XM.Project = {}; }
  
  XM.Project.isDispatchable = true;

  XM.Project.options = [
    "DefaultPriority"
  ];

  /*
  Return Project configuration settings.

  @returns {Object}
  */
  XM.Project.settings = function() {
    var keys = XM.Project.options.slice(0),
        data = Object.create(XT.Data),
        ret = {},
        qry,
        orm;

    ret = XT.extend(ret, data.retrieveMetrics(keys));

    /* Special processing for primary key based values */
    orm = XT.Orm.fetch("XM", "Priority");
    ret.DefaultPriority = data.getNaturalId(orm, ret.DefaultPriority);

    return ret;
  };

    /*
  Update Project configuration settings. Only valid options as defined in the array
  XM.Project.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Project.commitSettings = function(patches) {
    var sql,
      settings,
      options = XM.Project.options.slice(0),
      data = Object.create(XT.Data),
      metrics = {};

    /* Compose our commit settings by applying the patch to what we already have */
    settings = JSON.parse(XM.Project.settings());
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }

    /* update remaining options as metrics
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }

    /* Special processing for primary key based values */
    if (metrics.DefaultPriority) {
      orm = XT.Orm.fetch("XM", "Priority");
      metrics.DefaultPriority = data.getId(orm, metrics.DefaultPriority);
    }

    return data.commitMetrics(metrics);
  }

$$ );
