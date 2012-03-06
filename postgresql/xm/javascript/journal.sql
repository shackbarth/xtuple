select xt.install_js('XM','Journal','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Journal = {};
  
  XM.Journal.isDispatchable = true;
  
  /** 
   Post Journals by Series or by Type.

     Series: target will be a series id.
             No other parameters required.

       Type: target will be a journal type.
             startDate, endDate, and distributionDate required.
             *** By Type NOT currently implemented ***

   @param {Number || String, Date, Date, Date} target, startDate, endDate, distributionDate
   @returns {Number}
  */
  XM.Journal.post = function(target, startDate, endDate, distributionDate) {
    var data = Object.create(XT.Data),
        isPostByType = false,
        ret, err;

    if(!data.checkPrivilege('PostJournals')) err = "Access Denied.";
    else if(target === undefined) err = "Series number or Journal type required.";
    else if(typeof target === 'string') {
      if(startDate === undefined || endDate === undefined || distributionDate === undefined)
        err = "Start date, End date, and Distribution date required.";
      else isPostByType = true;
    };

    if(!err) {

      if(!isPostByType) {
        ret = executeSql("select postjournals($1) as result;", [target])[0].result;
        switch (ret)
        {
          case -4:
            err = "Cannot post to closed period.";
            break;
          default:
            return ret;
        }
      }

      else return -1;
    }

    throw new Error(err);
  }

$$ );