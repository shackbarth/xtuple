drop view if exists xt.opheadinfo cascade;

create or replace view xt.opheadinfo as 

   select ophead.*, coalesce(incdtpriority_order, 99999) as priority_order
   from ophead
     left join incdtpriority on (ophead_priority_id=incdtpriority_id);

grant all on table xt.opheadinfo to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.opheadinfo
  do instead nothing;


create or replace rule "_UPDATE" as on update to xt.opheadinfo
  do instead nothing;


create or replace rule "_DELETE" as on delete to xt.opheadinfo
  do instead nothing;
  