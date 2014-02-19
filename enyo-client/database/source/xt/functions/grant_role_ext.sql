drop function if exists xt.grant_role_ext(text, text);

create or replace function xt.grant_role_ext(role_name text, ext_name text) returns boolean volatile as $$

  var sqlCount = "select count(*) as count from xt.grpext where grpext_grp_id = $1 and grpext_ext_id = $2;",
    sqlInsert = "insert into xt.grpext (grpext_grp_id, grpext_ext_id) values ($1, $2);",
    sqlRoleId = "select grp_id from public.grp where grp_name = $1;",
    sqlExtId = "select ext_id from xt.ext where ext_name = $1;",
    roleId = plv8.execute(sqlRoleId, [role_name.toUpperCase()])[0].grp_id,
    extId = plv8.execute(sqlExtId, [ext_name])[0].ext_id,
    count;

  if (!roleId || !extId) {
    plv8.elog(WARNING, "Cannot grant Role: ", role_name, " Extension: ", priv_name, ". The Role or Extension has not been created yet.");

    return false;
  } else {
    count = plv8.execute(sqlCount, [roleId, extId])[0].count;
  }

  if(count > 0) {
    return false;
  }

  plv8.execute(sqlInsert, [roleId, extId]);

  return true;

$$ language plv8;
