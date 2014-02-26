drop function if exists xt.grant_user_role(text, text);

create or replace function xt.grant_user_role(username text, role_name text) returns boolean volatile as $$

  var sqlCount = "select count(*) as count from public.usrgrp where usrgrp_username = $1 and usrgrp_grp_id = $2;",
    sqlInsert = "insert into public.usrgrp (usrgrp_username, usrgrp_grp_id) values ($1, $2);",
    sqlRoleId = "select grp_id from public.grp where grp_name = $1;",
    sqlUser = "select usr_username from public.usr where usr_username = $1;",
    roleId = plv8.execute(sqlRoleId, [role_name.toUpperCase()])[0].grp_id,
    user = plv8.execute(sqlUser, [username])[0].usr_username,
    count;

  if (!user || !roleId) {
    plv8.elog(WARNING, "Cannot grant User: ", username, " Role: ", role_name, ". The User or Role has not been created yet.");

    return false;
  } else {
    count = plv8.execute(sqlCount, [user, roleId])[0].count;
  }

  if(count > 0) {
    return false;
  }

  plv8.execute(sqlInsert, [user, roleId]);

  return true;

$$ language plv8;
