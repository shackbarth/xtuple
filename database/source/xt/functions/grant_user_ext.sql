drop function if exists xt.grant_user_ext(text, text);

create or replace function xt.grant_user_ext(user_name text, ext_name text) returns boolean volatile as $$

  var sqlCount = "select count(*) as count from xt.usrext where usrext_usr_username = $1 and usrext_ext_id = $2;",
    sqlInsert = "insert into xt.usrext (usrext_usr_username, usrext_ext_id) values ($1, $2);",
    sqlUser = "select usr_username from public.usr where usr_username = $1;",
    sqlExtId = "select ext_id from xt.ext where ext_name = $1;",
    user = plv8.execute(sqlUser, [user_name]),
    ext = plv8.execute(sqlExtId, [ext_name]),
    userName,
    extId,
    count;

  if (!user.length || !ext.length) {
    plv8.elog(WARNING, "Cannot grant User: ", user_name, " Extension: ", ext_name, ". The User or Extension has not been created yet.");

    return false;
  } else {
    userName = user[0].usr_username;
    extId = ext[0].ext_id;
    count = plv8.execute(sqlCount, [userName, extId])[0].count;
  }

  if(count > 0) {
    return false;
  }

  plv8.execute(sqlInsert, [userName, extId]);

  return true;

$$ language plv8;
