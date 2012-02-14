create view private.itemcost as 

select 
  itemcost_id,
  itemcost_item_id,
  itemcost_costelem_id,
  itemcost_lowlevel,
  itemcost_stdcost,
  false as itemcost_post,
  itemcost_posted,
  itemcost_actcost,
  itemcost.itemcost_updated,
  itemcost.itemcost_curr_id
from itemcost;

-- insert rule

create or replace rule "_CREATE_INSERT" as on insert to private.itemcost
  do instead (

insert into itemcost (
  itemcost_id,
  itemcost_item_id,
  itemcost_costelem_id,
  itemcost_posted,
  itemcost_actcost,
  itemcost_updated,
  itemcost_curr_id )
values (
  new.itemcost_id,
  new.itemcost_item_id,
  new.itemcost_costelem_id,
  startoftime(),
  new.itemcost_actcost,
  current_date,
  new.itemcost_curr_id );

-- if flag is set, post actual cost to std cost
select postcost(new.itemcost_id)
where (new.itemcost_post);

);

create or replace rule "_CREATE_CHECK_CREATECOSTS" as on insert to private.itemcost 
   where not checkPrivilege('CreateCosts') do instead

  select private.raise_exception('You do not have privileges to create Item Costs');

create or replace rule "_CREATE_CHECK_POST" as on insert to private.itemcost 
   where (new.itemcost_post)
     and not (checkPrivilege('PostActualCosts')) do instead

  select private.raise_exception('You do not have privileges to Post Actual Costs to Standard Costs');


create or replace rule "_CREATE_CHECK_ACTIVE" as on insert to private.itemcost 
   where not (select costelem_active
              from costelem 
              where costelem_id = new.itemcost_costelem_id) do instead

  select private.raise_exception('You must choose an active Cost Element');

create or replace rule "_CREATE_CHECK_MATERIAL" as on insert to private.itemcost 
   where (select (count(*) > 0)
	  from itemcost
	  join item i on itemcost_item_id = i.item_id
	  join costelem c on itemcost_costelem_id = c.costelem_id
	  where (c.costelem_type = 'Material'
	         and i.item_type not in ('O', 'P'))
	   and itemcost_item_id = new.itemcost_item_id
	   and itemcost_costelem_id = new.itemcost_costelem_id) do instead

  select private.raise_exception('The Material Cost Element may only be associated with Purchased or Outside Processed Items');


create or replace rule "_CREATE_CHECK_DUPLICATES" as on insert to private.itemcost 
   where (select (count(*) > 0)
	  from itemcost
	  where ((not itemcost_lowlevel)
	   and (itemcost_item_id = new.itemcost_item_id))
	   and itemcost_costelem_id = new.itemcost_costelem_id) do instead

  select private.raise_exception('This Item already has all available Costing Elements assigned. No new Item Costs can be created for it until more Costing Elements are defined.');

-- update rule

create or replace rule "_UPDATE" as on update to private.itemcost
  do instead (

update itemcost set
  itemcost_actcost = new.itemcost_actcost,
  itemcost_updated = current_date,
  itemcost_curr_id = new.itemcost_curr_id
where ( itemcost_id = old.itemcost_id );

-- if flag is set, post actual cost to std cost
select postcost(new.itemcost_id)
where (new.itemcost_post);

);

create or replace rule "_CREATE_CHECK_ENTERACTUAL" as on update to private.itemcost
   where not checkPrivilege('EnterActualCosts') do instead

  select private.raise_exception('You do not have privileges to update Actual Costs');


create or replace rule "_CREATE_CHECK_POST" as on update to private.itemcost 
   where (new.itemcost_post)
     and not (checkPrivilege('PostActualCosts')) do instead

  select private.raise_exception('You do not have privileges to Post Actual Costs to Standard Costs');

-- delete rule

create or replace rule "_DELETE" as on delete to private.itemcost
  do instead

delete from itemcost
where (itemcost_id = old.itemcost_id);

create or replace rule "_CREATE_CHECK_PRIV" as on delete to private.itemcost
   where not checkPrivilege('DeleteCosts') do instead

  select private.raise_exception('You do not have privileges to delete Item Costs');



