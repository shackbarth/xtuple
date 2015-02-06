/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine the default shared access grants
 * set when a user creates an object. That is set by thext.orm_did_change()
 * trigger.
 */

select xt.create_view('xt.share_users_default', $$

  -- Default shared access grants.
  SELECT
    obj_share_target_uuid::uuid AS obj_uuid,
    obj_share_username::text AS username
  FROM xt.obj_share;

$$, false);
