-- table definition

insert into xt.priv
select src.priv_id, src.priv_name, src.priv_descrip, '', src.priv_module, 'xtuple'
from public.priv src
where not exists (
  select chk.priv_id
  from xt.priv chk
  where chk.priv_id=src.priv_id
);

do $$
  
  var i, key, group,
    keys = ['Contact', 'Incident', 'ToDo', 'Project', 'Opportunit', 'CRMAccount'],
    groups = ['Contacts', 'Incidents', 'ToDos', 'Projects', 'Opportunities', 'Accounts'],
    sql;

  // TODO: be smarter about the labeling. Use "Maintain" instead of "Maintain Contacts"
  sql = "update xt.priv set priv_label = priv_name;";
  plv8.execute(sql);

  sql = "update xt.priv set priv_group = 'Setup' where priv_group = 'System';";
  plv8.execute(sql);

  for(i = 0; i < keys.length; i++) {
    key = keys[i];
    group = groups[i];
    sql = "update xt.priv set priv_group = '" + group + "' where priv_name LIKE '%" + key + "%';";
    plv8.execute(sql);
  }


$$ language plv8;
