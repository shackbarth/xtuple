select xt.create_view('xt.cntctinfo', $$

select cntct.*, a.crmacct_number, p.crmacct_number as crmacct_parent_number 
from cntct 
  left join crmacct a on a.crmacct_id=cntct_crmacct_id
  left join crmacct p on a.crmacct_parent_id=p.crmacct_id;

$$);

