select xt.install_js('XM','Quote','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Quote = {};

  XM.Quote.isDispatchable = true;

  /**
    Fetch the next quote number. Need a special over-ride here because of peculiar
    behavior of quote numbering different from all other generated numbers.
  */
  XM.Quote.fetchNumber = function () {
    return plv8.execute("select fetchqunumber() as number")[0].number;
  };
  

  /**
    Release a quote number. Need a special over-ride here because of peculiar
    behavior of quote numbering different from all other generated numbers.

    @param {String} Number
    @returns Number
  */
  XM.Quote.releaseNumber = function (recordType, num) {
    return plv8.execute("select releasequnumber($1) as result", [num])[0].result;
  };
  
$$ );
