-- Create a node user
do $$

  var sql1 = "select * from xt.usr where usr_id = 'admin'",
    sql2 = "insert into xt.usr values ('admin', 'fc6ce0425b04bcd4d713fe011137d985');",
    sql3 = "insert into xt.useracct (useracct_username, useracct_active, useracct_propername) values ('admin',true, 'Default Administration User');",
    sql4 = "insert into xt.userpriv (userpriv_priv_id, userpriv_username) select priv_id, 'admin' from xt.priv;",
    ret;

  ret = plv8.execute(sql1);
  if (!ret.length) {
    plv8.execute(sql2);
    plv8.execute(sql3);
    plv8.execute(sql4);
  }

$$ language plv8;

insert into xt.usrorg (usrorg_org_name, usrorg_username, usrorg_usr_id)
select a.org_name, 'admin', 'admin'
from xt.org a where a.org_name not in (
  select b.usrorg_org_name
  from xt.usrorg b
  where b.usrorg_usr_id = 'admin'
)