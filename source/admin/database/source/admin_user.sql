-- Create an admin user
do $$

  var sql1 = "select * from xt.useracct where useracct_username = 'admin'",
    sql2 = "insert into xt.useracct (useracct_username, useracct_active, useracct_propername) values ('admin',true, 'Default Administration User');",
    sql3 = "insert into usrpriv (usrpriv_priv_id, usrpriv_username) select priv_id, 'admin' from xt.priv;",
    ret;

  ret = plv8.execute(sql1);
  if (!ret.length) {
    plv8.execute(sql2);
    plv8.execute(sql3);
  }

$$ language plv8;
