/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a contact. That associaiton is either the main user
 * account, owner's user account or customer's sale rep's user account.
 *
 * This view can be used to determine which users have personal privilege
 * access to a contact based on what CRM Account it belongs to.
 */

select xt.create_view('xt.crmacctcntct_users', $$

SELECT
  cntct_id,
  array_agg(username) AS crmacct_usernames
FROM (
  SELECT
    cntct_id,
    cntct_crmacct_id
  FROM cntct
) cntct_crmacct_ids
LEFT JOIN xt.crmacct_users ON cntct_crmacct_id = crmacct_id
WHERE 1=1
  AND username IS NOT NULL
GROUP BY cntct_id;

$$, false);
