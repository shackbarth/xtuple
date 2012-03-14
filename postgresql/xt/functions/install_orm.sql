create or replace function xt.install_orm(json text) returns void volatile as $$                                
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select xt.js_init()');

  XT.Orm.install(json);
  
$$ language plv8;
