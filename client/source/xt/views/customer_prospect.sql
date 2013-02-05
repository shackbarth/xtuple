create or replace view xt.customer_prospect as
  
  select cust_id as id, cust_active as active, cust_number as number, cust_name as name, 
    cust_cntct_id as contact, cust_ffshipto, cust_ffbillto, cust_curr_id, cust_terms_id, 
    cust_creditstatus, cust_salesrep_id as salesrep_id, cust_commprcnt, cust_discntprcnt, 
    cust_taxzone_id as taxzone_id, cust_shipchrg_id, cust_comments as comments, 
    cust_preferred_warehous_id as site, 'C' as type
  from custinfo
  union
  select prospect_id as id, prospect_active as active, prospect_number as number,
    prospect_name as name, prospect_cntct_id as contact, null as cust_ffshipto, 
    null as cust_ffbillto, null as cust_curr_id, null as cust_terms_id, 
    null as cust_creditstatus, prospect_salesrep_id as salesrep_id, null as cust_commprcnt, 
    null as cust_discntprcnt, null as taxzone_id, null as cust_shipchrg_id, 
    prospect_comments as comments, prospect_warehous_id as site, 'P' as type
  from prospect;