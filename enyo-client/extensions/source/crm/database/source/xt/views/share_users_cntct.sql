/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to a Contact based on what CRM Account it belongs to.
 */

select xt.create_view('xt.share_users_cntct', $$

  -- Contact CRM Account's users.
  SELECT
    cntct_crmacct_ids.obj_uuid::uuid AS obj_uuid,
    username::text AS username
  FROM (
    SELECT
      cntct.obj_uuid,
      cntct_crmacct_id
    FROM cntct
  ) cntct_crmacct_ids
  LEFT JOIN xt.crmacct_users ON cntct_crmacct_id = crmacct_id
  WHERE 1=1
    AND username IS NOT NULL;

$$, false);
