/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account. That associaiton is either the main user account, owner's user
 * account or customer's sale rep's user account.
 *
 * This view can be used to determine which user's have personal privilege
 * access to resources based on what CRM Account they belong to. Just get the
 * resource's parent CRM account id and join this view with it.
 *
 * @See: xt.crmacctaddr_users
 */

select xt.create_view('xt.crmacct_users', $$

  -- CRM Account's username
  SELECT
    crmacct_id,
    crmacct_usr_username AS username
  FROM crmacct
  WHERE 1=1
    AND crmacct_usr_username IS NOT NULL
  -- CRM Account's Owner's username
  UNION
  SELECT
    crmacct_id,
    crmacct_owner_username AS username
  FROM crmacct
  WHERE 1=1
    AND crmacct_owner_username IS NOT NULL
  -- CRM Account's Customer's Rep's username
  UNION
  SELECT
    crmacct.crmacct_id,
    crmacct_rep.crmacct_usr_username AS username
  FROM crmacct
  JOIN custinfo ON crmacct_cust_id = cust_id
  JOIN salesrep ON cust_salesrep_id = salesrep_id
  JOIN crmacct crmacct_rep ON crmacct_rep.crmacct_salesrep_id = salesrep_id
  WHERE 1=1
    AND crmacct_rep.crmacct_usr_username IS NOT NULL;

$$, false);
