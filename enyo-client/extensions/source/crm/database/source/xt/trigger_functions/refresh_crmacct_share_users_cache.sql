create or replace function xt.refresh_crmacct_share_users_cache() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {
  var parentUserSql = 'select crmacct_usr_username as username ' +
                      'from crmacct ' +
                      'where crmacct_id = $1;',
    parentOwnerSql = 'select crmacct_owner_username as username ' +
                      'from crmacct ' +
                      'where crmacct_id = $1;';

  if (typeof XT === 'undefined') {
    plv8.execute("select xt.js_init();");
  }

  if (TG_OP === 'INSERT') {
    if (NEW.crmacct_usr_username !== null || NEW.crmacct_usr_username !== '') {
      /* Refresh this CRM Account's share access. */
      XT.ShareUsers.refreshCacheUser(NEW.crmacct_usr_username);

      /* Refresh this CRM Account's Owner share access. */
      XT.ShareUsers.refreshCacheUser(NEW.crmacct_owner_username);
    }

    if (NEW.crmacct_parent_id !== null || NEW.crmacct_parent_id !== '') {
      /* Refresh this CRM Account's Parents share access. */
      XT.ShareUsers.refreshRelationCacheUser(parentUserSql, [NEW.crmacct_parent_id]);

      /* Refresh this CRM Account's Owner share access. */
      XT.ShareUsers.refreshRelationCacheUser(parentOwnerSql, [NEW.crmacct_parent_id]);
    }
  } else if (TG_OP === 'UPDATE') {
    /* If the CRM Account's crmacct_usr_username changed, refresh the CRM Account user's share access. */
    if (OLD.crmacct_usr_username !== NEW.crmacct_usr_username) {
      /* Refresh this CRM Account old user's share access. */
      XT.ShareUsers.refreshCacheUser(OLD.crmacct_usr_username);
      /* Refresh this CRM Account new user's share access. */
      XT.ShareUsers.refreshCacheUser(NEW.crmacct_usr_username);
    }

    /* If the CRM Account's crmacct_owner_username changed, refresh the CRM Account Owner's share access. */
    if (OLD.crmacct_owner_username !== NEW.crmacct_owner_username) {
      /* Refresh this CRM Account old user's share access. */
      XT.ShareUsers.refreshCacheUser(OLD.crmacct_owner_username);
      /* Refresh this CRM Account new user's share access. */
      XT.ShareUsers.refreshCacheUser(NEW.crmacct_owner_username);
    }

    /* If the CRM Account's crmacct_parent_id changed, refresh the new and old Parent CRM Account's share access. */
    if (OLD.crmacct_parent_id !== NEW.crmacct_parent_id) {
      if (OLD.crmacct_parent_id !== null || OLD.crmacct_parent_id !== '') {
        /* Refresh the old CRM Account's Parents share access. */
        XT.ShareUsers.refreshRelationCacheUser(parentUserSql, [OLD.crmacct_parent_id]);

        /* Refresh th old CRM Account's Owner share access. */
        XT.ShareUsers.refreshRelationCacheUser(parentOwnerSql, [OLD.crmacct_parent_id]);
      }

      if (NEW.crmacct_parent_id !== null || NEW.crmacct_parent_id !== '') {
        /* Refresh the new CRM Account's Parents share access. */
        XT.ShareUsers.refreshRelationCacheUser(parentUserSql, [NEW.crmacct_parent_id]);

        /* Refresh th new CRM Account's Owner share access. */
        XT.ShareUsers.refreshRelationCacheUser(parentOwnerSql, [NEW.crmacct_parent_id]);
      }
    }
  } else if (TG_OP === 'DELETE') {
    /* Delete share access cache for this CRM Account user by refreshing it. */
    XT.ShareUsers.refreshCacheUser(OLD.crmacct_usr_username);

    /* Delete share access cache for this CRM Account Owner by refreshing it. */
    XT.ShareUsers.refreshCacheUser(OLD.crmacct_owner_username);

    if (OLD.crmacct_parent_id !== null || OLD.crmacct_parent_id !== '') {
      /* Refresh the old CRM Account's Parents share access. */
      XT.ShareUsers.refreshRelationCacheUser(parentUserSql, [OLD.crmacct_parent_id]);

      /* Refresh th old CRM Account's Owner share access. */
      XT.ShareUsers.refreshRelationCacheUser(parentOwnerSql, [OLD.crmacct_parent_id]);
    }
  }

  return NEW;
}());

$$ language plv8;
