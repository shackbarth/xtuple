select xt.create_view('xt.opheadinfo', $$
   select ophead.*, coalesce(incdtpriority_order, 99999) as priority_order,
     crmacct_number, cntct_number  
   from ophead  
     join crmacct on crmacct_id=ophead_crmacct_id 
     left join cntct on cntct_id=ophead_cntct_id 
     left join incdtpriority on (ophead_priority_id=incdtpriority_id);
$$);

