drop view if exists xt.todoiteminfo cascade;

create or replace view xt.todoiteminfo as 

   select todoitem.*, coalesce(incdtpriority_order, 99999) as priority_order
   from todoitem
     left join incdtpriority on (todoitem_priority_id=incdtpriority_id);

grant all on table xt.todoiteminfo to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.todoiteminfo
  do instead nothing;


create or replace rule "_UPDATE" as on update to xt.todoiteminfo
  do instead nothing;


create or replace rule "_DELETE" as on delete to xt.todoiteminfo
  do instead nothing;
  