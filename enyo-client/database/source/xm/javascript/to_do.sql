select xt.install_js('XM','ToDo','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.ToDo = {};
  
  XM.ToDo.isDispatchable = true;
  
  /** 
   Create 1 or more recurring ToDos

   @param {Number} ToDoId
   @returns {Number}
  */
  XM.ToDo.createRecurring = function(toDoId) {
    var sql1 = "select createrecurringitems(todoitem_id, 'TODO') as result from todoitem where obj_uuid = $1;",
      sql2 = "select createrecurringitems(null, 'TODO');",
      data = Object.create(XT.Data),
      err;

    if(!data.checkPrivilege('MaintainAllToDoItems') && !data.checkPrivilege('MaintainPersonalToDoItems'))
      err = "Access Denied.";

    if(!err) {
      return plv8.execute(toDoId ? sql1 : sql2)[0].result;
    }

    throw new Error(err);
  }

$$ );

