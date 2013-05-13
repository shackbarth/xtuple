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
    var sql1 = "select createrecurringitems(prj_id, 'J') as result from prj where prj_number = $1;",
      sql2 = "select createrecurringitems(null, 'J');",
      data = Object.create(XT.Data),
      err;

    if(!data.checkPrivilege('MaintainAllProjects') && !data.checkPrivilege('MaintainPersonalProjects'))
      err = "Access Denied.";

    if(!err) {
      return plv8.execute(projectId ? sql1 : sql2)[0].result;
    }

    throw new Error(err);
  }

$$ );
