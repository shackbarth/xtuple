create or replace function xt.refresh_obj_share_cache() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {
  var refreshNew = false;

  if (typeof XT === 'undefined') {
    plv8.execute("select xt.js_init();");
  }

  /*
   * This type of share is explicitly granted on an object to a user, for
   * example, when a user adds a new address, they are granted share access to
   * it through the xt.obj_share table. Whenever there is a change to this table
   * we perform cache invaidation and refreshing on this object.
   */
  if (TG_OP === 'INSERT') {
      /* Refresh this object's share access. */
      XT.ShareUsers.refreshCacheObj(NEW.obj_share_target_uuid);
  } else if (TG_OP === 'UPDATE') {
    if (OLD.obj_share_username !== NEW.obj_share_username) {
      refreshNew =  true;
    }
    if (OLD.obj_share_target_uuid !== NEW.obj_share_target_uuid) {
      refreshNew =  true;

      /* Refresh the OLD object's share access. */
      XT.ShareUsers.refreshCacheObj(OLD.obj_share_target_uuid);
    }

    if (refreshNew) {
      /* Refresh this object's share access. */
      XT.ShareUsers.refreshCacheObj(NEW.obj_share_target_uuid);
    }
  } else if (TG_OP === 'DELETE') {
    /*
     * Refresh the share access cache for this object. It may still be shared
     * through a relation, so we can't just delete it from the cache.
     */
    XT.ShareUsers.refreshCacheObj(OLD.obj_share_target_uuid);
  }

  return NEW;
}());

$$ language plv8;
