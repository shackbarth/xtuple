select xt.install_js('XM','Manufacturing','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Manufacturing) { XM.Manufacturing = {options: []}; }

  XM.Manufacturing.isDispatchable = true;

  XM.Manufacturing.options = [
    "WorkOrderChangeLog",
    "AutoExplodeWO",
    "ExplodeWOEffective",  
    "PostMaterialVariances",
    "WOExplosionLevel",
    "DefaultWomatlIssueMethod",
    "NextWorkOrderNumber",
    "WONumberGeneration",
    "JobItemCosDefault"
  ];

  /* 
  Return Manufacturing configuration settings.

  @returns {Object}
  */
  XM.Manufacturing.settings = function() {
    var keys = XM.Manufacturing.options.slice(0),
        data = Object.create(XT.Data),
        sql = "select fetchwonumber();",
        ret = {},
        qry;

    ret.NextWorkOrderNumber = plv8.execute(sql)[0].value;  
      
    ret = XT.extend(ret, data.retrieveMetrics(keys));

    return JSON.stringify(ret);
  };
  
  /* 
  Update Manufacturing configuration settings. Only valid options as defined in the array
  XM.Manufacturing.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Manufacturing.commitSettings = function(patches) {
    var sql, settings,
      options = XM.Manufacturing.options.slice(0),
      data = Object.create(XT.Data), 
      metrics = {};
        
    /* check privileges */
    if(!data.checkPrivilege('ConfigureWO')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    settings = JSON.parse(XM.Manufacturing.settings());
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }
    
    /* update numbers */
    if(settings['NextWorkOrderNumber']) {
      plv8.execute("select setnextwonumber($1)", [settings['NextWorkOrderNumber'] - 0]);
    }
    options.remove('NextWorkOrderNumber'); 

    /* update remaining options as metrics
      first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  };

}());
  
$$ );
