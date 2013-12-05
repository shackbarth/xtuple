select xt.install_js('XM','Purchasing','purchasing', $$
  /* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple.
     See www.xtuple.com/CPAL for the full text of the software license. */

  if (!XM.Purchasing) { XM.Purchasing = {}; }

  XM.Purchasing.isDispatchable = true;

  XM.Purchasing.options = [
  ];

  /*
  Return Purchasing configuration settings.

  @returns {Object}
  */
  XM.Purchasing.settings = function() {
    var keys = XM.Purchasing.options.slice(0),
        data = Object.create(XT.Data);

    return data.retrieveMetrics(keys);
  };

   /*
  Update Purchasing configuration settings. Only valid options as defined in the array
  XM.Purchasing.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Purchasing.commitSettings = function(patches) {
    var sql,
      K = XM.Purchasing,
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
