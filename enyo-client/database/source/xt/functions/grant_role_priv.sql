drop function if exists xt.grant_role_priv(text, text, text);

create or replace function xt.grant_role_priv(role_name text, priv_module text, priv_name text) returns boolean volatile as $$

  var sqlCount = "select count(*) as count from public.grppriv where grppriv_grp_id = $1 and grppriv_priv_id = $2;",
    sqlInsert = "insert into public.grppriv (grppriv_grp_id, grppriv_priv_id) values ($1, $2);",
    sqlRoleId = "select grp_id from public.grp where grp_name = $1;",
    sqlPrivId = "select priv_id from public.priv where priv_module = $1 and priv_name = $2;",
    roleId = plv8.execute(sqlRoleId, [role_name.toUpperCase()])[0],
    privId = plv8.execute(sqlPrivId, [priv_module, priv_name])[0],
    count;

  if (!roleId || !privId) {
    plv8.elog(WARNING, "Cannot grant Role: ", role_name, " Privilege: ", 
      priv_name, ". The Role or Privilege has not been created yet.");
    return false;

  } else {
    roleId = roleId.grp_id;
    privId = privId.priv_id;
    count = plv8.execute(sqlCount, [roleId, privId])[0].count;
  }

  if(count > 0) {
    return false;
  }

  plv8.execute(sqlInsert, [roleId, privId]);

  return true;

$$ language plv8;
