do $$
  
  var qry = plv8.execute("select * from metric where metric_name = 'ServerVersion'"),
    major = qry[0].metric_value.slice(0,1),
    minor = qry[0].metric_value.slice(2,3);

  if (major < 4 || (major === "4" && minor < 2)) {
    plv8.elog(ERROR, "Database version must be 4.2.0 or higher");
  }

$$ language plv8;
