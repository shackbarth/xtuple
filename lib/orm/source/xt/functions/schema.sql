create or replace function xt.getSchema(namespace text, type text) returns text as $$
  try {
    /* usage: select xt.getSchema('XM', 'Contact'); */
    var orm = XT.Orm.fetch(namespace, type);
    return JSON.stringify(orm);
  } catch (err) {
    XT.error(err);
  }
$$ LANGUAGE plv8;
