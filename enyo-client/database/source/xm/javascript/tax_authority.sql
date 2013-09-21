select xt.install_js('XM','Tax','xtuple', $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.TaxAuthority) { XM.TaxAuthority = {}; }

  XM.TaxAuthority.isDispatchable = true;

  /**
    Return whether a tax authority is referenced by another table.
    
    @param {String} Tax Authority Number
  */
  XM.TaxAuthority.used = function(id) {
    var exceptions = ["public.crmacct"];
    return XM.PrivateModel.used("XM.TaxAuthority", id, exceptions);
  };

}());
  
$$ );

