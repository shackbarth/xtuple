create or replace function xt.install_orm(json text) returns void volatile as $$
  try {
    XT.Orm.install(json);
    XT.message(200, "OK");
  } catch (err) {
    XT.error(err);
  }

$$ language plv8;
