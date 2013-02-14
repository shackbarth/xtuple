create or replace function xt.add_priv(name text, descrip text, label text, groop text, context text, 
    module text, grant_admin boolean) returns boolean volatile as $$

  var sqlCount = "select count(*) as count from public.priv where priv_name = $1;",
    sqlId = "select nextval('priv_priv_id_seq') as sequence;",
    sqlInsertPublic = "insert into public.priv (priv_id, priv_name, priv_module, priv_descrip) values ($1, $2, $3, $4)", 
    sqlInsertXT = "insert into xt.priv (priv_id, priv_name, priv_module, priv_descrip, priv_label, priv_group, priv_context) values ($1, $2, $3, $4, $5, $6, $7)", 
    sqlGrant = "insert into public.usrpriv (usrpriv_priv_id, usrpriv_username) values ($1, $2);",
    count = plv8.execute(sqlCount, [ name ])[0].count,
    nextId;

    if(count > 0) {
      return false;
    }

    nextId = plv8.execute(sqlId)[0].sequence;

    plv8.execute(sqlInsertPublic, [nextId, name, module, descrip]);
    plv8.execute(sqlInsertXT, [nextId, name, module, descrip, label, groop, context]);

    if(grant_admin) {
      plv8.execute(sqlGrant, [nextId, 'admin']);
    }


    return true;
$$ language plv8;
