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
    return {result: result};
  };
  XM.UserPreference.getPreference.description = "Return the user preferences for the logged-in user";
  XM.UserPreference.getPreference.request = {
    "$ref": "GetPreference"
  };
  XM.UserPreference.getPreference.parameterOrder = [
    "name"
  ];
  XM.UserPreference.getPreference.schema = {
    GetPreference: {
      properties: {
        attributes: {
          title: "Service request attributes",
          description: "An array of attributes needed to get a users preferences.",
          type: "array",
          items: [
            {
              title: "Name",
              description: "Preference Name",
              type: "text",
              required: true
            }
          ],
          "minItems": 1,
          "maxItems": 1,
          required: true
        }
      }
    }
  };

  XM.UserPreference.commitPreference = function (name, value) {
    var sql = "update xt.userpref set userpref_value = $3 where userpref_usr_username = $1 and userpref_name = $2; " +
      "insert into xt.userpref (userpref_usr_username, userpref_name, userpref_value) " +
      "select $1, $2, $3 " +
      "where not exists (select 1 from xt.userpref where userpref_usr_username = $1 and userpref_name = $2)";
    var result = plv8.execute(sql, [XT.username, name, value]);
    return {result: result};
  };
  XM.UserPreference.commitPreference.description = "Persist a user preferences for the logged-in user";
  XM.UserPreference.commitPreference.request = {
    "$ref": "CommitPreference"
  };
  XM.UserPreference.commitPreference.parameterOrder = [
    "name",
    "value"
  ];
  XM.UserPreference.commitPreference.schema = {
    CommitPreference: {
      properties: {
        attributes: {
          title: "Service request attributes",
          description: "An array of attributes needed to set a users preferences.",
          type: "array",
          items: [
            {
              title: "Name",
              description: "Preference Name",
              type: "text",
              required: true
            },
            {
              title: "Value",
              description: "Preference Value",
              type: "text",
              required: true
            }
          ],
          "minItems": 2,
          "maxItems": 2,
          required: true
        }
      }
    }
  };

$$ );

