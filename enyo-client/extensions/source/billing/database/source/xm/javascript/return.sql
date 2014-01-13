select xt.install_js('XM','Return','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Return = {
    isDispatchable: true
  };

  XM.Return.post = function(returnNumber, itemLocSeries) {
    var returnId = XT.Data.getId(XT.Orm.fetch('XM', 'Return'), returnNumber);
    return XT.executeFunction("postcreditmemo", [returnId, itemLocSeries || 0]);
  };

  XM.Return.void = function(returnNumber) {
    var returnId = XT.Data.getId(XT.Orm.fetch('XM', 'Return'), returnNumber);
    return XT.executeFunction("voidcreditmemo", [returnId]);
  };
$$ );
