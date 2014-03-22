/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to an Address based on what CRM Account it belongs.
 */

select xt.create_view('xt.share_users_addr', $$

  -- Address CRM Account's users.
  SELECT
    xt.crmacctaddr.obj_uuid::uuid AS obj_uuid,
    username::text AS username
  FROM xt.crmacctaddr
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL;

$$, false);
