create or replace function public.getEffectiveXtUser() returns text as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

  if (!plv8.XT) {
    plv8.execute('select xt.js_init();');
    XT.username = plv8.execute('select current_user as username')[0].username;
  }

  /* When a connection is made and query sent without calling seteffectivextuser() */
  /* default to current_user if XT.username is undefined. */
  if (!XT.username) {
    XT.username = plv8.execute('select current_user as username')[0].username;
  }

  return XT.username;

$$ language 'plv8' stable;

