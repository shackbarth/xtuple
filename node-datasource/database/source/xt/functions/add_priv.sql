create or replace function xt.add_priv(name text, descrip text, label text, groop text, context text, 
    module text) returns boolean volatile as $$

  var sqlCount = "select count(*) as count from xt.priv where priv_name = $1;",
    sqlInsert = "insert into xt.priv (priv_name, priv_module, priv_descrip, priv_label, priv_group, priv_context) values ($1, $2, $3, $4, $5, $6)", 
    count = plv8.execute(sqlCount, [ name ])[0].count;

    if(count > 0) {
      return false;
    }

    plv8.execute(sqlInsert, [name, module, descrip, label, groop, context]);
    return true;

$$ language plv8;
