select xt.install_js('XM','Prospect','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Prospect) { XM.Prospect = {}; }

  XM.Prospect.isDispatchable = true;

  /**
    Return whether a Prospect is referenced by another table.
    
    @param {String} Prospect Number
  */
  XM.Prospect.used = function(id) {
    var exceptions = ["public.crmacct"];
    return XM.PrivateModel.used("XM.Prospect", id, exceptions);
  };

}());
  
$$ );

