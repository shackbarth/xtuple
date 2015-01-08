drop function if exists xt.grant_user_priv(text, text, text);

create or replace function xt.grant_user_priv(user_name text, priv_module text, priv_name text) returns boolean volatile as $$

  var sqlCount = "select count(*) as count from public.usrpriv where usrpriv_username = $1 and usrpriv_priv_id = $2;",
    sqlInsert = "insert into public.usrpriv (usrpriv_username, usrpriv_priv_id) values ($1, $2);",
    sqlUser = "select usr_username from public.usr where usr_username = $1;",
    sqlPrivId = "select priv_id from public.priv where priv_module = $1 and priv_name = $2;",
    user = plv8.execute(sqlUser, [user_name]),
    priv = plv8.execute(sqlPrivId, [priv_module, priv_name]),
    count;

  if (!user.length || !priv.length) {
    plv8.elog(WARNING, "Cannot grant User: ", user_name, " Privilege: ", priv_name, ". The User or Privilege has not been created yet.");

    return false;
  } else {
    userName = user[0].usr_username;
    privId = priv[0].priv_id;
    count = plv8.execute(sqlCount, [userName, privId])[0].count;
  }

  if(count > 0) {
    return false;
  }

  plv8.execute(sqlInsert, [userName, privId]);

  return true;

$$ language plv8;
