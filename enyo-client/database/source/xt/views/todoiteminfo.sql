select xt.create_view('xt.todoiteminfo', $$
   select todoitem.*, coalesce(incdtpriority_order, 99999) as priority_order,  
     crmacct_number, cntct_number, incdt_number, ophead_number
   from todoitem  
     left join incdtpriority on todoitem_priority_id=incdtpriority_id  
     left join crmacct on crmacct_id = todoitem_crmacct_id  
     left join cntct on cntct_id = todoitem_cntct_id
     left join incdt on incdt_id = todoitem_incdt_id
     left join ophead on ophead_id = todoitem_ophead_id
$$);
