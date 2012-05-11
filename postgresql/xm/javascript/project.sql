select xt.install_js('XM','Project','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Project = {};
  
  XM.Project.isDispatchable = true;
  
  /** 
   Create 1 or more recurring Projects

   @param {Number} ProjectId
   @returns {Number}
  */
  XM.Project.createRecurring = function(projectId) {
    var sql = "select createrecurringitems({id}, 'J') as result;"
              .replace(/{id}/, projectId === undefined ? null : projectId),
        data = Object.create(XT.Data),
        err;

    if(!data.checkPrivilege('MaintainAllProjects') && !data.checkPrivilege('MaintainPersonalProjects'))
      err = "Access Denied.";

    if(!err) {
      return plv8.execute(sql)[0].result;
    }

    throw new Error(err);
  }

$$ );
