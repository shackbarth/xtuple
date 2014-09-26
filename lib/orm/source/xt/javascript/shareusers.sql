select xt.install_js('XT','ShareUsers','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

(function () {

  /**
   * The XT.ShareUsers object contains methods to interact with the object share
   * cache. To increase performance of Share Users Access Checking in XT.Data,
   * the object share access derrived through relations defined in the
   * xt.share_users view is cached to a static table, xt.cache_share_users.
   * This cache table is used for all share user access checking. Because this
   * table is a cache, cache invaidation and refreshing is performed by
   * triggers on the underlying tables. Those triggers make use of the
   * XT.ShareUsers methods below to encapsulate the cache invaidation and
   * refreshing logic.
   */
  XT.ShareUsers = {};

  /**
   * Refresh the entire Share Users Access cache for all objects.
   */
  XT.ShareUsers.refreshCache = function() {
    var refreshSql = 'select xt.refresh_share_user_cache()';

    plv8.execute(refreshSql);
  }

  /**
   * Refresh the Share Users Access cache for a single object.
   *
   * @param {UUID} The UUID of the object to refresh the cache for.
   */
  XT.ShareUsers.refreshCacheObj = function(refreshObjUuid) {
    var refreshObjSql = 'select xt.refresh_cache_share_users_obj($1)';

    plv8.execute(refreshObjSql, [refreshObjUuid]);
  }

  /**
   * Refresh the Share Users Access cache for a single object derrived from a
   * relations query. When performing cache invaidation and refreshing from a
   * table's trigger, sometime you need to do cache invaidation and refreshing
   * on a related object. This method allows you to pass a query and parameters
   * that will find a matching object's UUID. If a UUID is found, this method
   * will call the XT.ShareUsers.refreshCacheObj() method on it.
   *
   * @param {string} A query to execute that will return an object's UUID.
   * @param {array} The query parameters to pass in when executing the query.
   */
  XT.ShareUsers.refreshRelationCacheObj = function(query, params) {
    objUuid = plv8.execute(query, params);
    if (objUuid.length && objUuid[0].obj_uuid) {
      XT.ShareUsers.refreshCacheObj(objUuid[0].obj_uuid);
    }
  }

  /**
   * Delete a single object from the Share Users Access cache. This method will
   * first delete any explicit share access grants made through the xt.obj_share
   * table. Next, it will refresh that Share Users Access cache for the object,
   * which should delete any cached Share Users Access grants for this object
   * because it no longer exists.
   *
   * This method should be invoked in an AFTER trigger for a DELETE event
   * ensuring the object record has already been removed from the table.
   *
   * @param {UUID} The UUID of the object to refresh the cache for.
   */
  XT.ShareUsers.deleteCacheObj = function(deleteObjUuid) {
    var deleteExplicitObjSql = 'delete from xt.obj_share where obj_share_target_uuid = $1';

    /* Delete any explicit grants for this Contact. */
    plv8.execute(deleteExplicitObjSql, [deleteObjUuid]);

    /* Refresh the cache for this object, effectively deleting any refrences. */
    XT.ShareUsers.refreshCacheObj(deleteObjUuid);
  }

}());

$$ );
