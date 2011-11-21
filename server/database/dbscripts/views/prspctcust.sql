select dropifexists('view','prspctcust','xt');
create view xt.prspctcust as (
select 
  cust_id as prspctcust_id,
  cust_number as prspctcust_number,
  cust_name as prspctcust_name,
  cust_active as prspctcust_active,
  true as prspctcust_cust,
  cust_cntct_id as prspctcust_cntct_id
from custinfo
union all
select
  prospect_id as prspctcust_id,
  prospect_number as prspctcust_number,
  prospect_name as prspctcust_name,
  prospect_active as prspctcust_active,
  false as prspctcust_cust,
  prospect_cntct_id as prspctcust_cntct_id
from prospect
);

comment on view xt.prspctcust IS 'A union of prospect and customer records for use in cases where both can be used in the same context.';

grant all on table xt.prspctcust to xtrole;

