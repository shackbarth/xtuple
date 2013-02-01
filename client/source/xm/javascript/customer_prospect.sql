create or replace view xt.customer_prospect as
  
  select cust_number AS number, cust_name AS name, cust_cntct_id as contact, 'C' as type
  from custinfo
  union
  select prospect_number AS number, prospect_name AS name, prospect_cntct_id AS contact, 'P' as type
  from prospect;