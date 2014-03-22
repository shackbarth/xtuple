select xt.install_js('XM','Incident','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Incident = {};
  
  XM.Incident.isDispatchable = true;
  
  /** 
   Create 1 or more recurring Incidents

   @param {Number} IncidentId
   @returns {Number}
  */
  XM.Incident.createRecurring = function(incidentId) {
    var sql1 = "select createrecurringitems(incdt_id, 'INCDT') as result from incident where incident_number = $1;",
      sql2 = "select createrecurringitems(null, 'INCDT');",
      data = Object.create(XT.Data),
      err;

    if(!data.checkPrivilege('MaintainAllIncidents') && !data.checkPrivilege('MaintainPersonalIncidents'))
      err = "Access Denied.";

    if(!err) {
      return plv8.execute(incidentId ? sql1 : sql2)[0].result;
    }

    throw new Error(err);
  }

$$ );

