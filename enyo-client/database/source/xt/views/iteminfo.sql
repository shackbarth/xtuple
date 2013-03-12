drop view if exists xt.iteminfo cascade;

create or replace view xt.iteminfo as 

   select *,
     stdcost(item_id) as std_cost,
     iteminvpricerat(item_id) as inv_price_ratio
   from item;

grant all on table xt.iteminfo to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.iteminfo
  do instead nothing;


create or replace rule "_UPDATE" as on update to xt.iteminfo
  do instead nothing;


create or replace rule "_DELETE" as on delete to xt.iteminfo
  do instead nothing;
  