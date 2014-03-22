drop function if exists xt.workflow_notify(uuid);

create or replace function xt.workflow_notify(uuid uuid) returns boolean volatile as $$

  /* TODO: this is only set up for sales order workflows. Generalize upon the next use case */
  var selectSql = "select cohead.*, emlprofile.*, wf_owner.usr_email as owner_email, " +
      "wf_assigned.usr_email as assigned_email " +
      "from xt.wf " +
      "left join xt.usrlite wf_owner on wf_owner_username = wf_owner.usr_username " +
      "left join xt.usrlite wf_assigned on wf_assigned_username = wf_assigned.usr_username " +
      "inner join cohead on wf_parent_uuid = cohead.obj_uuid " +
      "inner join saletype on cohead_saletype_id = saletype_id " +
      "inner join xt.saletypeext on saletypeext_id = saletype_id " +
      "inner join xt.emlprofile on saletypeext_emlprofile_id = emlprofile_id " +
      "where wf.obj_uuid = $1;",
    currentUserEmailSql = "select usr_email from xt.usrlite where usr_username = $1",
    currentUserResult = plv8.execute(currentUserEmailSql, [XT.username]),
    currentUserEmail = currentUserResult.length ? currentUserResult[0].usr_email : "",
    objectSql = "select xt.js_init();select xt.get($1);",
    getObj,
    objectData,
    results,
    result,
    toAddresses,
    payload,
    /* mimics backbone-x getValue on a POJSO */
    getValue = function (data, attr) {
      var dataClone = JSON.parse(JSON.stringify(data)),
        prefix,
        suffix;

      while(attr.indexOf(".") >= 0) {
        prefix = attr.beforeDot();

        attr = attr.substring(attr.indexOf(".") + 1);
        dataClone = dataClone[prefix];
      }
      return dataClone[attr];
    },
    /* replace curly braces with data from the data object */
    format = function (data, str) {
      str = str || "";
      var parser = /\{([^}]+)\}/g, // Finds curly braces
        tokens,
        attr;
      tokens = str.match(parser) || [];
      tokens.map(function (token) {
        attr = token.slice(1, token.indexOf('}'));
        str = str.replace(token, getValue(data, attr));
      });
      return str;
    };

  results = plv8.execute(selectSql, [uuid]);

  if(!results.length) {
    return;
  }
  result = results[0],

  /* the to address will be whatever is in the profile, plus the owner and 
    assigned-to user on the task */
  toAddresses = result.emlprofile_to ? result.emlprofile_to.split(",") : [];
  if(result.owner_email) {
    toAddresses.push(result.owner_email);
  }
  if(result.assigned_email) {
    toAddresses.push(result.assigned_email);
  }

  /* remove duplicate email addresses */
  toAddresses = toAddresses.unique();
  
  /* do not send an email to the user who is responsible for the change */
  toAddresses = toAddresses.filter(function (address) {
    return address !== currentUserEmail;
  });

  getObj = {
    username: XT.username,
    nameSpace: "XM",
    type: "SalesOrder",
    id: result.cohead_number
  };

  objectData = plv8.execute(objectSql, [JSON.stringify(getObj)])[0].get;
  objectData = JSON.parse(objectData).data;

  payload = {action: "email", content: {
    from: result.emlprofile_from,
    replyTo: result.emlprofile_replyto,
    to: toAddresses,
    cc: result.emlprofile_cc,
    bcc: result.emlprofile_bcc,
    subject: format(objectData, result.emlprofile_subject),
    text: format(objectData, result.emlprofile_body)
  }};
  plv8.execute("select pg_notify($1, $2);", ["nodext", JSON.stringify(payload)]);

$$ language plv8;

