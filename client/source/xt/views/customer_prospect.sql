create or replace view xt.customer_prospect as
  
  select cust_number as number, cust_name as name, cust_cntct_id as contact, 'C' as type
  from custinfo
  union
  select prospect_number as number, prospect_name as name, prospect_cntct_id as contact, 'P' as type
  from prospect;