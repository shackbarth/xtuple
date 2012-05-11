select xt.install_js('XM','Incident','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Incident = {};
  
  XM.Incident.isDispatchable = true;
  
  /** 
   Create 1 or more recurring Incidents

   @param {Number} IncidentId
   @returns {Number}
  */
  XM.Incident.createRecurring = function(incidentId) {
    var sql = "select createrecurringitems({id}, 'INCDT') as result;"
              .replace(/{id}/, incidentId === undefined ? null : incidentId),
        data = Object.create(XT.Data),
        err;

    if(!data.checkPrivilege('MaintainAllIncidents') && !data.checkPrivilege('MaintainPersonalIncidents'))
      err = "Access Denied.";

    if(!err) {
      return plv8.execute(sql)[0].result;
    }

    throw new Error(err);
  }

$$ );

