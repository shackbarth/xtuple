-- Create a default org, which is associated with every user and every extension
do $$

  var sql1 = "select * from xt.org",
    sql2 = "insert into xt.org (org_name, org_descrip, org_licenses, org_active, org_group) values " +
      "('default', 'Default Organization', 10, true, 'xtrole');",
    sql3 = "insert into xt.useracctorg (useracctorg_useracct_id, useracctorg_org_id) " +
      "select useracct_id, org_id from xt.useracct " +
      "cross join xt.org " +
      "where org_name = 'default'",
    ret;

  ret = plv8.execute(sql1);
  if (!ret.length) {
    plv8.execute(sql2);
    plv8.execute(sql3);
  }

$$ language plv8;
