select xt.install_js('XM','StandardJournal','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.StandardJournal = {};
  
  XM.StandardJournal.isDispatchable = true;
  
  /** 
   Post a standard journal to the ...

   @param {Number, Date, Booean} standardJournalId, distributionDate, isReverse
   @returns {Number}
  */
  XM.StandardJournal.post = function(standardJournalId, distributionDate, isReverse) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostStandardJournals')) err = "Access Denied.";

    if(!err) {
      return executeSql("select poststandardjournal($1, $2, $3) as result;", [standardJournalId, distributionDate, isReverse])[0].result;

    }

    throw new Error(err);
  }

  /** 
   Post a standard journal group to the ...

   @param {Number, Date, Boolean} standardJournalGroupId, distributionDate, isReverse
   @returns {Number}
  */
  XM.StandardJournal.postGroup = function(standardJournalGroupId, distributionDate, isReverse) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostStandardJournalGroups')) err = "Access Denied.";

    if(!err) {
      return executeSql("select poststandardjournalgroup($1, $2, $3) as result;", [standardJournalGroupId, distributionDate, isReverse])[0].result;

    }

    throw new Error(err);
  }

$$ );