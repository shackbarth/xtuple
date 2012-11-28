select xt.install_js('XM','User','admin', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.User = {};
  
  XM.User.isDispatchable = true;

  /** 
    Pass in a record type and get the next id for that type 

    @param {String} record type
    @returns Number
  */
  XM.User.resetPassword = function(id) { 

    /* thanks http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript */
    var newPassword = Math.random().toString(36).substr(2,10);
    plv8.elog(NOTICE, "Resetting password");
    plv8.execute('update xt.usr set usr_password = $1 where usr_id = $2;', [newPassword, id]);
    return true;

  };

$$ );
