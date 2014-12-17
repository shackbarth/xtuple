/**
   This is really not a good idea beacuse address relationships are not generally extensible
   using a union like this. Implementing this way because of time constraints. A
   different method more like the way documents are handled shoud be used in the future.
*/
create or replace view xt.crmacctaddr as

  -- Contact
  select addr.*, crmacct_id
  from addr
    join cntct ON (cntct_addr_id=addr_id)
    join crmacct ON (crmacct_id=cntct_crmacct_id)
  union
  -- Vendor
  select addr.*, crmacct_id
  from addr
    join vendinfo ON (vend_addr_id=addr_id)
    join crmacct ON (vend_id=crmacct_vend_id)
  union
  -- Vendor Addresses
  select addr.*, crmacct_id
  from addr
    join vendaddrinfo on (vendaddr_addr_id=addr_id)
    join crmacct on (vendaddr_vend_id=crmacct_vend_id)
  union
  -- Tax Authority
  select addr.*, crmacct_id
  from addr
    join taxauth on (taxauth_addr_id=addr_id)
    join crmacct on (taxauth_id=crmacct_taxauth_id)
  union
  -- Customer Billing Contact
  select addr.*, crmacct_id
  from addr
    join cntct on (cntct_addr_id=addr_id)
    join custinfo on (cust_cntct_id=cntct_id)
    join crmacct on (crmacct_cust_id=cust_id)
  union
  -- Customer Correspondence Contact
  select addr.*, crmacct_id
  from addr
    join cntct on (cntct_addr_id=addr_id)
    join custinfo on (cust_corrcntct_id=cntct_id)
    join crmacct on (crmacct_cust_id=cust_id)
  union
  -- Customer Ship-to
  select addr.*, crmacct_id
  from addr
    join shiptoinfo on (shipto_addr_id=addr_id)
    join crmacct on (crmacct_cust_id=shipto_cust_id);

grant all on xt.crmacctaddr to xtrole;
