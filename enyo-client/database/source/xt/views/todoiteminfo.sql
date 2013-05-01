select xt.create_view('xt.todoiteminfo', $$
   select todoitem.*, coalesce(incdtpriority_order, 99999) as priority_order,  
     crmacct_number, cntct_number  
   from todoitem  
     left join incdtpriority on todoitem_priority_id=incdtpriority_id  
     left join crmacct on crmacct_id = todoitem_crmacct_id  
     left join cntct on cntct_id = todoitem_cntct_id;;
$$);
