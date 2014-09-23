/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to a Customer that a Ship To is on based on what CRM Account the
 * Ship To belongs to.
 */

select xt.create_view('xt.share_users_shipto_cust', $$

  -- Customer that is for a Ship To CRM Account's users.
  SELECT
    shipto_cust_crmacct_id.obj_uuid::uuid AS obj_uuid,
    username::text AS username
  FROM (
    SELECT
      custinfo.obj_uuid,
      crmacct.crmacct_id
    FROM shiptoinfo
    LEFT JOIN crmacct ON crmacct_cust_id = shipto_cust_id
    LEFT JOIN custinfo ON cust_id = shipto_cust_id
  ) shipto_cust_crmacct_id
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL
    AND obj_uuid IS NOT NULL;

$$, false);
