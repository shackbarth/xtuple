create or replace function xt.refresh_cntct_share_users_cache() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {
  var addrUuidSql = 'select obj_uuid from addr where addr_id = $1',
    refreshAddr = false;

  if (typeof XT === 'undefined') {
    plv8.execute("select xt.js_init();");
  }

  if (TG_OP === 'INSERT') {
    /* Refresh this Contact's share access. */
    XT.ShareUsers.refreshCacheObj(NEW.obj_uuid);

    /* Refresh this Contact's Address's share access. */
    XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [NEW.cntct_addr_id]);
  } else if (TG_OP === 'UPDATE') {
    /* If the Contact's CRM Account changed, refresh the Contact and Address's share access. */
    if (OLD.cntct_crmacct_id !== NEW.cntct_crmacct_id) {
      XT.ShareUsers.refreshCacheObj(NEW.obj_uuid);
      refreshAddr = true;
    }

    /* If the Contact's Address changed, refresh the old Address and new Address's share access. */
    if (OLD.cntct_addr_id !== NEW.cntct_addr_id) {
      XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [OLD.cntct_addr_id]);
      refreshAddr = true;
    }

    /* Refresh the new Address's share access. */
    if (refreshAddr) {
      XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [NEW.cntct_addr_id]);
    }
  } else if (TG_OP === 'DELETE') {
    /* Delete share access cache for this Contact. */
    XT.ShareUsers.deleteCacheObj(OLD.obj_uuid);

    /* Refresh the old Address's share access. */
    XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [OLD.cntct_addr_id]);
  }

  return NEW;
}());

$$ language plv8;
