select xt.create_view('xt.incdtinfo', $$
   select incdt_id, incdt_number::text, incdt_summary, incdt_status, incdt_incdtcat_id,   
     incdt_crmacct_id, incdt_cntct_id, incdt_incdtpriority_id, incdt_incdtseverity_id,  
     incdt_incdtresolution_id, incdt_owner_username, incdt_assigned_username, incdt_prj_id,  
     incdt_timestamp, incdt_updated, coalesce(incdtpriority_order, 99999) as incdtpriority_order,  
     status_seq, crmacct_number, cntct_number  
   from incdt  
     join status on incdt_status=status_code  
     join crmacct on  crmacct_id=incdt_crmacct_id  
     join cntct on cntct_id=incdt_cntct_id  
     left join incdtpriority on (incdt_incdtpriority_id=incdtpriority_id);
$$);
