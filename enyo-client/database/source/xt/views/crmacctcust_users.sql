/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a customer. That associaiton is either the main user
 * account, owner's user account or customer's sale rep's user account.
 *
 * This view can be used to determine which users have personal privilege
 * access to a customer based on what CRM Account it belongs to.
 */

select xt.create_view('xt.customer_users', $$

SELECT
  cust_id,
  array_agg(username) AS crmacct_usernames
FROM (
  SELECT
    cust_id,
    crmacct_id
  FROM custinfo
  JOIN crmacct ON cust_id = crmacct_cust_id
) cust_crmacct_ids
LEFT JOIN xt.crmacct_users USING (crmacct_id)
WHERE 1=1
  AND username IS NOT NULL
GROUP BY cust_id;

$$, false);
