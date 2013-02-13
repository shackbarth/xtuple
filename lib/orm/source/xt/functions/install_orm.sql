create or replace function xt.install_orm(json text) returns void volatile as $$                                

  XT.Orm.install(json);
  
$$ language plv8;
