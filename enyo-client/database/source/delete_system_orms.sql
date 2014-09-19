do $$
 /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
    See www.xtuple.com/CPAL for the full text of the software license. */

  plv8.execute("select xt.js_init();");
  plv8.execute("alter table xt.orm disable trigger orm_did_change;");
  plv8.execute("delete from xt.orm where orm_json ~ '\"isSystem\":true';");
  plv8.execute("alter table xt.orm enable trigger orm_did_change;");

$$ language plv8;
