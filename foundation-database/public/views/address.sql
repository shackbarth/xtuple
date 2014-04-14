SELECT dropIfExists('VIEW', 'address');

CREATE VIEW address AS

SELECT * FROM ( 
  SELECT * FROM ( 
    SELECT addr.*, COALESCE(crmacct_id,-1) AS crmacct_id, crmacct_number, crmacct_name 
    FROM addr 
    LEFT OUTER JOIN cntct ON (cntct_addr_id=addr_id) 
    LEFT OUTER JOIN crmacct ON (crmacct_id=cntct_crmacct_id) 
    -- Exclude addresses tied directly to crm accounts 
    -- that will be included in UNION below later
    EXCEPT 
    SELECT addr.*, -1, NULL, NULL 
    FROM addr 
    JOIN vendinfo ON (vend_addr_id=addr_id) 
    JOIN crmacct ON (vend_id=crmacct_vend_id) 
    EXCEPT 
    SELECT addr.*, -1, NULL, NULL 
    FROM addr 
    JOIN vendaddrinfo ON (vendaddr_addr_id=addr_id) 
    JOIN crmacct ON (vendaddr_vend_id=crmacct_vend_id) 
    EXCEPT 
    SELECT addr.*, -1, NULL, NULL 
    FROM addr 
    JOIN taxauth ON (taxauth_addr_id=addr_id) 
    JOIN crmacct ON (taxauth_id=crmacct_taxauth_id) 
    EXCEPT 
    SELECT addr.*, -1, NULL, NULL 
    FROM addr 
    JOIN shiptoinfo ON (shipto_addr_id=addr_id) 
    JOIN crmacct ON (shipto_cust_id=crmacct_cust_id) 
  ) AS base 
  UNION 
  -- Vendor
  SELECT addr.*, crmacct_id, crmacct_number, crmacct_name 
  FROM addr 
  JOIN vendinfo ON (vend_addr_id=addr_id) 
  JOIN crmacct ON (vend_id=crmacct_vend_id) 
  UNION
  -- Vendor Addresses
  SELECT addr.*, crmacct_id, crmacct_number, crmacct_name 
  FROM addr 
  JOIN vendaddrinfo ON (vendaddr_addr_id=addr_id) 
  JOIN crmacct ON (vendaddr_vend_id=crmacct_vend_id) 
  UNION 
  -- Tax Authority
  SELECT addr.*, crmacct_id, crmacct_number, crmacct_name 
  FROM addr 
  JOIN taxauth ON (taxauth_addr_id=addr_id) 
  JOIN crmacct ON (taxauth_id=crmacct_taxauth_id) 
  UNION 
  -- Customer Ship-to
  SELECT addr.*, crmacct_id, crmacct_number, crmacct_name 
  FROM addr 
  JOIN shiptoinfo ON (shipto_addr_id=addr_id) 
  JOIN crmacct ON (shipto_cust_id=crmacct_cust_id) 
) AS addresses 
ORDER BY addr_country, addr_state, addr_postalcode, addr_line1, addr_line2, addr_line3; 

GRANT ALL ON address TO xtrole;
