create or replace function xt.refresh_custinfo_share_users_cache() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {
  var addrUuidSql = 'select addr.obj_uuid ' +
                    'from addr ' +
                    'left join cntct ON cntct.cntct_addr_id = addr.addr_id ' +
                    'where cntct_id = $1',
    cntctUuidSql = 'select obj_uuid from cntct where cntct_id = $1';

  if (typeof XT === 'undefined') {
    plv8.execute("select xt.js_init();");
  }

  if (TG_OP === 'INSERT') {
    /* Refresh this Customer's share access. */
    XT.ShareUsers.refreshCacheObj(NEW.obj_uuid);
  } else if (TG_OP === 'UPDATE') {
    /**
     * Because the Ship To's Contact is used to provide limited Child CRM Account
     * Share Access to Billing and Correspondence Contacts, if the Contact changes,
     * we need to refresh them and their address. Standard CRM Account Share
     * Access would already have access through the cntct_crmacct_id column.
     */
    if (OLD.cust_cntct_id !== NEW.cust_cntct_id) {
      XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [OLD.cust_cntct_id]);
      XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [NEW.cust_cntct_id]);
      XT.ShareUsers.refreshRelationCacheObj(cntctUuidSql, [OLD.cust_cntct_id]);
      XT.ShareUsers.refreshRelationCacheObj(cntctUuidSql, [NEW.cust_cntct_id]);
    }

    if (OLD.cust_corrcntct_id !== NEW.cust_corrcntct_id) {
      XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [OLD.cust_corrcntct_id]);
      XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [NEW.cust_corrcntct_id]);
      XT.ShareUsers.refreshRelationCacheObj(cntctUuidSql, [OLD.cust_corrcntct_id]);
      XT.ShareUsers.refreshRelationCacheObj(cntctUuidSql, [NEW.cust_corrcntct_id]);
    }
  } else if (TG_OP === 'DELETE') {
    /* Delete share access cache for this Customer. */
    XT.ShareUsers.deleteCacheObj(OLD.obj_uuid);
  }

  return NEW;
}());

$$ language plv8;
