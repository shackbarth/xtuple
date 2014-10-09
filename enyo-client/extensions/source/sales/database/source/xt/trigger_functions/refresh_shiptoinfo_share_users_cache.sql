create or replace function xt.refresh_shiptoinfo_share_users_cache() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {
  var addrUuidSql = 'select obj_uuid from addr where addr_id = $1',
    childUserSql =  'select crmacct_usr_username as username ' +
                    'from cntct ' +
                    'left join crmacct on crmacct.crmacct_id = cntct.cntct_crmacct_id ' +
                    'where cntct_id = $1 ' +
                    '  and crmacct_usr_username is not null;',
    cntctUuidSql = 'select obj_uuid from cntct where cntct_id = $1',
    custUuidSql = 'select obj_uuid from custinfo where cust_id = $1',
    refreshAddr = false,
    refreshCntct = false,
    refreshCust = false,
    refreshShipTo = false;

  if (typeof XT === 'undefined') {
    plv8.execute("select xt.js_init();");
  }

  if (TG_OP === 'INSERT') {
    /* Refresh this Ship To's share access. */
    XT.ShareUsers.refreshCacheObj(NEW.obj_uuid);

    /* Refresh this Ship To's Address's share access. */
    XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [NEW.shipto_addr_id]);

    /* Refresh this Ship To's Contact's share access. */
    XT.ShareUsers.refreshRelationCacheObj(cntctUuidSql, [NEW.shipto_cntct_id]);

    /* Refresh this Ship To's Customer's share access. */
    XT.ShareUsers.refreshRelationCacheObj(custUuidSql, [NEW.shipto_cust_id]);
  } else if (TG_OP === 'UPDATE') {
    /* If the Ship To's Address changed, refresh the old Address and new Address's share access. */
    if (OLD.shipto_addr_id !== NEW.shipto_addr_id) {
      XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [OLD.shipto_addr_id]);
      refreshAddr = true;
    }

    /* If the Ship To's Contact changed, refresh the old Contact and new Contact's share access. */
    if (OLD.shipto_cntct_id !== NEW.shipto_cntct_id) {
      /**
       * If this Contact is associated with a Child CRM Account, find it's
       * UserAccount and refresh access for that username.
       */
      XT.ShareUsers.refreshRelationCacheUser(childUserSql, [OLD.shipto_cntct_id]);
      XT.ShareUsers.refreshRelationCacheUser(childUserSql, [NEW.shipto_cntct_id]);

      /**
       * Because the Ship To's Contact is used to provide limited Child CRM Account
       * Share Access, if the Contact changes, we need to refresh everything.
       */
      refreshAddr = true;
      XT.ShareUsers.refreshRelationCacheObj(cntctUuidSql, [OLD.shipto_cntct_id]);
      refreshCntct = true;
      refreshCust = true;
      refreshShipTo = true;
    }

    /* If the Ship To's Customer changed, refresh the old Customer and new Customer's share access. */
    if (OLD.shipto_cust_id !== NEW.shipto_cust_id) {
      /* The Customer should nerver change, but if it does, we want to refresh everything. */
      refreshAddr = true;
      refreshCntct = true;
      XT.ShareUsers.refreshRelationCacheObj(custUuidSql, [OLD.shipto_cust_id]);
      refreshCust = true;
      refreshShipTo = true;
    }

    if (refreshAddr) {
      /* Refresh the Ship To's Address share access. */
      XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [NEW.shipto_addr_id]);
    }

    if (refreshCntct) {
      /* Refresh the Ship To's Contact share access. */
      XT.ShareUsers.refreshRelationCacheObj(cntctUuidSql, [NEW.shipto_cntct_id]);
    }

    if (refreshCust) {
      /* Refresh the Ship To's Customer share access. */
      XT.ShareUsers.refreshRelationCacheObj(custUuidSql, [NEW.shipto_cust_id]);
    }

    if (refreshShipTo) {
      /* Refresh the Ship To's share access. */
      XT.ShareUsers.refreshCacheObj(NEW.obj_uuid);
    }
  } else if (TG_OP === 'DELETE') {
    /* Delete share access cache for this Ship To. */
    XT.ShareUsers.deleteCacheObj(OLD.obj_uuid);

    /* Refresh the old Address's share access. */
    XT.ShareUsers.refreshRelationCacheObj(addrUuidSql, [OLD.shipto_addr_id]);

    /* Refresh the old Contact's share access. */
    XT.ShareUsers.refreshRelationCacheObj(cntctUuidSql, [OLD.shipto_cntct_id]);

    /* Refresh the old Customer's share access. */
    XT.ShareUsers.refreshRelationCacheObj(custUuidSql, [OLD.shipto_cust_id]);
  }

  return NEW;
}());

$$ language plv8;
