create or replace view xt.customer_prospect as
  
  select cust_id, cust_active, cust_custtype_id, cust_salesrep_id, cust_commprcnt,
    cust_name, cust_creditlmt, cust_creditrating, cust_financecharge, 
    cust_backorder, cust_partialship, cust_terms_id, cust_discntprcnt, cust_balmethod,
    cust_ffshipto, cust_shipform_id, cust_shipvia, cust_blanketpos, cust_shipchrg_id,
    cust_creditstatus, cust_comments, cust_ffbillto, cust_usespos, cust_number,
    cust_dateadded, cust_exported, cust_emaildelivery, cust_autoupdatestatus,
    cust_autoholdorders, cust_preferred_warehous_id, cust_curr_id, cust_creditlmt_curr_id,
    cust_cntct_id, cust_corrcntct_id, cust_gracedays, cust_taxzone_id,
    null AS prospect_id, null AS prospect_active, null AS prospect_number, null AS prospect_name, 
    null AS prospect_cntct_id, null AS prospect_comments, null AS prospect_created, 
    null AS prospect_salesrep_id, null AS prospect_warehous_id, null AS prospect_taxzone_id, 'C' as type
  from custinfo
  union
  select null AS cust_id, null AS cust_active, null AS cust_custtype_id, null AS cust_salesrep_id, 
    null AS cust_commprcnt, null AS cust_name, null AS cust_creditlmt, null AS cust_creditrating, 
    null AS cust_financecharge, null AS cust_backorder, null AS cust_partialship, null AS cust_terms_id, 
    null AS cust_discntprcnt, null AS cust_balmethod, null AS cust_ffshipto, null AS cust_shipform_id, 
    null AS cust_shipvia, null AS cust_blanketpos, null AS cust_shipchrg_id, null AS cust_creditstatus, 
    null AS cust_comments, null AS cust_ffbillto, null AS cust_usespos, null AS cust_number,
    null AS cust_dateadded, null AS cust_exported, null AS cust_emaildelivery, null AS cust_autoupdatestatus,
    null AS cust_autoholdorders, null AS cust_preferred_warehous_id, null AS cust_curr_id, 
    null AS cust_creditlmt_curr_id, null AS cust_cntct_id, null AS cust_corrcntct_id, null AS cust_gracedays, 
    null AS cust_taxzone_id, prospect_id, prospect_active, prospect_number, prospect_name, prospect_cntct_id, 
    prospect_comments, prospect_created, prospect_salesrep_id, prospect_warehous_id, prospect_taxzone_id, 'P' as type
  from prospect;