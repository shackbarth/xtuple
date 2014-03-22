drop function if exists xt.add_role(text, text);

create or replace function xt.add_role(name text, descrip text) returns boolean volatile as $$

  var sqlCount = "select count(*) as count from public.grp where grp_name = $1;",
    sqlInsert = "insert into public.grp (grp_name, grp_descrip) values ($1, $2)",
    count = plv8.execute(sqlCount, [name.toUpperCase()])[0].count;

  if(count > 0) {
    return false;
  }

  plv8.execute(sqlInsert, [name.toUpperCase(), descrip]);

  return true;

$$ language plv8;
