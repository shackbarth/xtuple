drop view if exists xt.incdtinfo cascade;

create or replace view xt.incdtinfo as 

   select incdt_id, incdt_number::text, incdt_summary, incdt_status, incdt_incdtcat_id, 
     incdt_crmacct_id, incdt_cntct_id, incdt_incdtpriority_id, incdt_incdtseverity_id,
     incdt_incdtresolution_id, incdt_owner_username, incdt_assigned_username,
     incdt_timestamp, incdt_updated
   from incdt;

grant all on table xt.incdtinfo to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.incdtinfo
  do instead nothing;


create or replace rule "_UPDATE" as on update to xt.incdtinfo
  do instead nothing;


create or replace rule "_DELETE" as on delete to xt.incdtinfo
  do instead nothing;
  