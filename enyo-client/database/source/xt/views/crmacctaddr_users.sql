/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns an address. That associaiton is either the main user
 * account, owner's user account or customer's sale rep's user account.
 *
 * This view can be used to determine which user's have personal privilege
 * access to an address based on what CRM Account it belongs to.
 */

select xt.create_view('xt.crmacctaddr_users', $$

SELECT
  addr_id,
  array_agg(username) AS crmacct_usernames
FROM (
  SELECT
    addr_id,
    crmacct_id
  FROM xt.crmacctaddr
) addr_crmacct_ids
LEFT JOIN xt.crmacct_users USING (crmacct_id)
WHERE 1=1
  AND username IS NOT NULL
GROUP BY addr_id;

$$, false);
