select xt.install_js('XM','UserPreference','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.UserPreference = {};
  XM.UserPreference.options = [];

  XM.UserPreference.isDispatchable = true,

  /* 
    Return UserPreference configuration settings.

  @returns {Object}
  */
  XM.UserPreference.settings = function() {
    var sql = "SELECT * FROM xt.userpref WHERE userpref_usr_username = $1",
      result = plv8.execute(sql, [XT.username]),
      resultObj = {};

    result.map(function (res) {
      resultObj[res.userpref_name] = res.userpref_value;
    });
    return JSON.stringify(resultObj);
  }

  /* 
    Update UserPreference configuration settings.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.UserPreference.commitSettings = function(patches) {
    var data = Object.create(XT.Data);

    /* check privileges */
    if(!data.checkPrivilege('MaintainPreferencesSelf')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    patches.map(function (patch) {
      var sql,
        updateSql = "UPDATE xt.userpref SET userpref_value = $1 WHERE userpref_usr_username = $2 AND userpref_name = $3;",
        insertSql = "INSERT INTO xt.userpref (userpref_value, userpref_usr_username, userpref_name) VALUES ($1, $2, $3);";
      
      plv8.elog(NOTICE, "patch", patch.op, JSON.stringify(patch));
      if (patch.op === 'add') {
        sql = insertSql;
      } else if(patch.op === 'replace') {
        sql = updateSql;
      } else {
        /* no other operation is supported */
        return;
      }
      
      plv8.execute(sql, [patch.value, XT.username, patch.path.substring(1)]);
    });
    return true;
  }
  
$$ );

