select xt.install_js('XM','SalesOrder','xtuple', $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.SalesOrder) { XM.SalesOrder = {}; }

  XM.SalesOrder.isDispatchable = true;

  /**
    Return whether a Sales Order is referenced by another table.
    
    @param {String} SalesOrder Number
  */
  XM.SalesOrder.used = function(id) {
    var exceptions = ["public.coitem"];
    return XM.PrivateModel.used("XM.SalesOrder", id, exceptions);
  };

}());
  
$$ );

