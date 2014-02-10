/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to a Customer based on what CRM Account it belongs to.
 */

select xt.create_view('xt.share_users_cust', $$

  -- Customer CRM Account's users.
  SELECT
    cust_crmacct_ids.obj_uuid::uuid AS obj_uuid,
    username::text AS username
  FROM (
    SELECT
      custinfo.obj_uuid,
      crmacct_id
    FROM custinfo
    JOIN crmacct ON cust_id = crmacct_cust_id
  ) cust_crmacct_ids
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL;

$$, false);
