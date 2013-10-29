select xt.create_view('xt.customer_prospect', $$

  select cust_id as id, cust_active as active, cust_number as number, cust_name as name, cust_custtype_id as type,
    cust_cntct_id as contact, cust_ffshipto, cust_ffbillto, cust_curr_id, cust_terms_id,
    cust_creditstatus, cust_salesrep_id as salesrep_id, cust_commprcnt, cust_discntprcnt,
    cust_taxzone_id as taxzone_id, cust_shipchrg_id, cust_comments as comments,
    cust_preferred_warehous_id as site, cust_shipvia as cust_shipvia,
    'C' as status, crmacct_id
  from custinfo
    join crmacct on crmacct_cust_id=cust_id
  union
  select prospect_id as id, prospect_active as active, prospect_number as number,
    prospect_name as name, null as type, prospect_cntct_id as contact, true as cust_ffshipto,
    true as cust_ffbillto, basecurrid() as cust_curr_id, null as cust_terms_id,
    null as cust_creditstatus, prospect_salesrep_id as salesrep_id, 0 as cust_commprcnt,
    null as cust_discntprcnt, prospect_taxzone_id as taxzone_id, null as cust_shipchrg_id,
    prospect_comments as comments, prospect_warehous_id as site,
    null as cust_shipvia, 'P' as status, crmacct_id
  from prospect
    join crmacct on crmacct_prospect_id=prospect_id; ;

$$);
