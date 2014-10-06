/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to a Contact that is on a Customer based on what CRM Account the
 * Customer belongs to.
 */

select xt.create_view('xt.share_users_cust_cntct', $$

  -- Contact that is on a Ship To CRM Account's users.
  SELECT
    cust_cntct_crmacct_ids.obj_uuid::uuid AS obj_uuid,
    username::text AS username
  FROM (
    SELECT
      cntct.obj_uuid,
      crmacct.crmacct_id
    FROM custinfo
    LEFT JOIN crmacct ON crmacct_cust_id = cust_id
    LEFT JOIN cntct ON cust_cntct_id = cntct_id OR cust_corrcntct_id = cntct_id
  ) cust_cntct_crmacct_ids
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL
    AND obj_uuid IS NOT NULL;

$$, false);
