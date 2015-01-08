select xt.install_js('XM','Vendor','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Vendor) { XM.Vendor = {}; }

  XM.Vendor.isDispatchable = true;

  /**
    Return whether a Vendor is referenced by another table.
    
    @param {String} Vendor Number
  */
  XM.Vendor.used = function(id) {
    var exceptions = ["public.crmacct"];
    return XM.PrivateModel.used("XM.Vendor", id, exceptions);
  };

}());
  
$$ );
