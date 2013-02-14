select xt.install_js('XM','ToDo','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.ToDo = {};
  
  XM.ToDo.isDispatchable = true;
  
  /** 
   Create 1 or more recurring ToDos

   @param {Number} ToDoId
   @returns {Number}
  */
  XM.ToDo.createRecurring = function(toDoId) {
    var sql = "select createrecurringitems({id}, 'TODO') as result;"
              .replace(/{id}/, toDoId === undefined ? null : toDoId),
        data = Object.create(XT.Data),
        err;

    if(!data.checkPrivilege('MaintainAllToDoItems') && !data.checkPrivilege('MaintainPersonalToDoItems'))
      err = "Access Denied.";

    if(!err) {
      return plv8.execute(sql)[0].result;
    }

    throw new Error(err);
  }

$$ );

