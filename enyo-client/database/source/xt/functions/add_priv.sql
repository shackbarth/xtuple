create or replace function xt.add_priv(name text, descrip text, module text) returns boolean volatile as $$

  var sqlCount = "select count(*) as count from public.priv where priv_name = $1;",
    sqlInsert = "insert into public.priv (priv_name, priv_module, priv_descrip) values ($1, $2, $3, $4)", 
    count = plv8.execute(sqlCount, [ name ])[0].count,
    nextId;

    if(count > 0) {
      return false;
    }

    plv8.execute(sqlInsert, [name, module, descrip]);
    return true;

$$ language plv8;
