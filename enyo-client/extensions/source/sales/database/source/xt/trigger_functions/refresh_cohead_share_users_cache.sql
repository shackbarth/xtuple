create or replace function xt.refresh_cohead_share_users_cache() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {
  if (typeof XT === 'undefined') {
    plv8.execute("select xt.js_init();");
  }

  if (TG_OP === 'INSERT') {
    /* Refresh this Sales Order's share access. */
    XT.ShareUsers.refreshCacheObj(NEW.obj_uuid);
  } else if (TG_OP === 'UPDATE') {
    /* If the Sales Order's Customer changed, refresh the Sales Order's share access. */
    if (OLD.cohead_cust_id !== NEW.cohead_cust_id) {
      XT.ShareUsers.refreshCacheObj(NEW.obj_uuid);
    }
  } else if (TG_OP === 'DELETE') {
    /* Delete share access cache for this Sales Order. */
    XT.ShareUsers.deleteCacheObj(OLD.obj_uuid);
  }

  return NEW;
}());

$$ language plv8;
