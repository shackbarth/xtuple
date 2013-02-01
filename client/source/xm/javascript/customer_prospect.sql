create or replace view xt.customer_prospect as
  
  select cust_id AS id, cust_number AS number, cust_name AS name, 'C' as type
  from custinfo
  union
  select prospect_id AS id, prospect_number AS number, prospect_name AS name, 'P' as type
  from prospect;