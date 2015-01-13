select xt.install_js('XM','UserPreference','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.UserPreference = {
    options: ["PrintSettings"]
  };
  XM.UserPreference.isDispatchable = true;

  XM.UserPreference.getPreference = function (name) {
    var sql = "select userpref_value from xt.userpref where userpref_usr_username = $1 and userpref_name = $2";
    var result = plv8.execute(sql, [XT.username, name]);
    return {status: 200, result: result, name: name};
  };
  XM.UserPreference.getPreference.description = "Return the user preferences for the logged-in user";
  XM.UserPreference.getPreference.request = {
    "$ref": "UserPreference"
  };
  XM.UserPreference.getPreference.parameterOrder = [
    "name"
  ];
  XM.UserPreference.getPreference.schema = {
  };

  XM.UserPreference.commitPreference = function (name, value) {
    var sql = "update xt.userpref set userpref_value = $3 where userpref_usr_username = $1 and userpref_name = $2; " +
      "insert into xt.userpref (userpref_usr_username, userpref_name, userpref_value) VALUES ($1, $2, $3) " +
      "where not exists (select 1 from xt.userpref where userpref_usr_username = $1 and userpref_name = $2)";
    var result = plv8.execute(sql, [XT.username, name, value]);
    return {status: 200, result: result, name: name};
  };
  XM.UserPreference.commitPreference.description = "Persist a user preferences for the logged-in user";
  XM.UserPreference.commitPreference.request = {
    "$ref": "UserPreference"
  };
  XM.UserPreference.commitPreference.parameterOrder = [
    "name",
    "value"
  ];
  XM.UserPreference.commitPreference.schema = {
  };

$$ );

