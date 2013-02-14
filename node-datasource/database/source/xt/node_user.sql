-- Create a node user
do $$

  var sql1 = "select * from xt.usr where usr_id = 'node'",
    sql2 = "insert into xt.usr values ('node', 'fc6ce0425b04bcd4d713fe011137d985');",
    sql3 = "insert into xt.useracct (useracct_username, useracct_active, useracct_propername) values ('node',true, 'Internal Node Datasource User');",
    sql4 = "insert into xt.userpriv (userpriv_priv_id, userpriv_username) select priv_id, 'node' from xt.priv;",
    ret;

  ret = plv8.execute(sql1);
  if (!ret.length) {
    plv8.execute(sql2);
    plv8.execute(sql3);
    plv8.execute(sql4);
  }

$$ language plv8;
