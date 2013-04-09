create or replace function xt.getSchema(namespace text, type text) returns text as $$
  /* usage: select xt.getSchema('XM', 'Contact'); */
  var orm = XT.Orm.fetch(namespace, type);
  return JSON.stringify(orm);
$$ LANGUAGE plv8;
