DROP VIEW IF EXISTS address;

CREATE VIEW address AS
SELECT addr.*,
       COALESCE(crmacct_id, -1) AS crmacct_id, crmacct_number, crmacct_name
  FROM addr
  LEFT OUTER JOIN (
    SELECT cntct_addr_id AS join_id, crmacct_id, crmacct_number, crmacct_name
    FROM cntct
    JOIN crmacct ON (cntct_crmacct_id=crmacct_id)
    UNION
    -- Vendor
    SELECT vend_addr_id, crmacct_id, crmacct_number, crmacct_name
    FROM vendinfo
    JOIN crmacct ON (vend_id=crmacct_vend_id)
    UNION
    -- Vendor Addresses
    SELECT vendaddr_addr_id, crmacct_id, crmacct_number, crmacct_name
    FROM vendaddrinfo
    JOIN crmacct ON (vendaddr_vend_id=crmacct_vend_id)
    UNION
    -- Tax Authority
    SELECT taxauth_addr_id, crmacct_id, crmacct_number, crmacct_name
    FROM taxauth
    JOIN crmacct ON (taxauth_id=crmacct_taxauth_id)
    UNION
    -- Customer Ship-to
    SELECT shipto_addr_id, crmacct_id, crmacct_number, crmacct_name
    FROM shiptoinfo
    JOIN crmacct ON (shipto_cust_id=crmacct_cust_id)
  ) AS addresses ON addr_id = join_id
;

GRANT ALL ON address TO xtrole;
