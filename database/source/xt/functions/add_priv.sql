drop function if exists xt.add_priv(text, text, text, text);

create or replace function xt.add_priv(name text, descrip text, module text, groop text) returns boolean volatile as $$

  var sqlCount = "select count(*) as count from public.priv where priv_name = $1;",
    sqlId = "select nextval('public.priv_priv_id_seq') as sequence;",
    sqlInsert = "insert into public.priv (priv_id, priv_name, priv_module, priv_descrip) values ($1, $2, $3, $4)",
    sqlGrantToAdmin = "select xt.grant_role_priv('ADMIN', $1, $2)",
    count = plv8.execute(sqlCount, [ name ])[0].count,
    nextId;

  if(count > 0) {
    /* Grant this priv to the 'ADMIN' role by default. */
    plv8.execute(sqlGrantToAdmin, [module, name]);

    return false;
  }

  nextId = plv8.execute(sqlId)[0].sequence;

  /* groop is a placeholder until we add a group column in xt.privinfo */
  /* groop is used to segment the assignment box */
  /* module is the name of the extension. was used to filter the assignment box, but doesn't do that any more */
  plv8.execute(sqlInsert, [nextId, name, module, descrip]);

  /* Grant this priv to the 'ADMIN' role by default. */
  plv8.execute(sqlGrantToAdmin, [module, name]);

  return true;

$$ language plv8;
