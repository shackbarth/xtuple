/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to a resource based on what CRM Account it belongs to or shared
 * access grants.
 */

select xt.create_view('xt.share_users', $$

  -- Address CRM Account's users.
  SELECT
    xt.crmacctaddr.obj_uuid,
    username
  FROM xt.crmacctaddr
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL

  -- Contact CRM Account's users.
  UNION
  SELECT
    cntct_crmacct_ids.obj_uuid,
    username
  FROM (
    SELECT
      cntct.obj_uuid,
      cntct_crmacct_id
    FROM cntct
  ) cntct_crmacct_ids
  LEFT JOIN xt.crmacct_users ON cntct_crmacct_id = crmacct_id
  WHERE 1=1
    AND username IS NOT NULL

  -- Customer CRM Account's users.
  UNION
  SELECT
    cust_crmacct_ids.obj_uuid,
    username
  FROM (
    SELECT
      custinfo.obj_uuid,
      crmacct_id
    FROM custinfo
    JOIN crmacct ON cust_id = crmacct_cust_id
  ) cust_crmacct_ids
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL

  -- Ship To CRM Account's users.
  UNION
  SELECT
    shiptoinfo.obj_uuid,
    username
  FROM shiptoinfo
  JOIN crmacct ON shipto_cust_id = crmacct_cust_id
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL

  -- Shared access grants.
  UNION
  SELECT
    obj_share_target_uuid AS obj_uuid,
    obj_share_username AS username
  FROM xt.obj_share;

$$, false);
