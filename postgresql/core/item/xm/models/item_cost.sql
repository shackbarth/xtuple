select private.create_model(

-- Model name, schema, table

'item_cost', 'public', 'itemcost',

-- Columns

E'{
  "itemcost.itemcost_id as guid",
  "itemcost.itemcost_item_id as item",
  "itemcost.itemcost_costelem_id as cost_element",
  "itemcost.itemcost_lowlevel as is_lower_level",
  "itemcost.itemcost_stdcost as standard_cost",
  "false as is_post_standard",
  "itemcost.itemcost_posted as posted",
  "itemcost.itemcost_actcost as actual_cost",
  "itemcost.itemcost_updated as updated",
  "itemcost.itemcost_curr_id as currency"
}',

-- sequence

'public.itemcost_itemcost_id_seq',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE_INSERT\\" as on insert to xm.item_cost
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
  new.guid,
  new.item,
  new.cost_element,
  startoftime(),
  new.actual_cost,
  current_date,
  new.currency );

-- if flag is set, post actual cost to std cost
select postcost(new.guid)
where (new.is_post_standard);

)

","

create or replace rule \\"_CREATE_CHECK_CREATECOSTS\\" as on insert to xm.item_cost 
   where not checkPrivilege(\'CreateCosts\') do instead

  select private.raise_exception(\'You do not have privileges to create Item Costs\');

","

create or replace rule \\"_CREATE_CHECK_POST\\" as on insert to xm.item_cost 
   where (new.is_post_standard)
     and not (checkPrivilege(\'PostActualCosts\')) do instead

  select private.raise_exception(\'You do not have privileges to Post Actual Costs to Standard Costs\');

","

create or replace rule \\"_CREATE_CHECK_ACTIVE\\" as on insert to xm.item_cost 
   where not (select costelem_active
              from costelem 
              where costelem_id = new.cost_element) do instead

  select private.raise_exception(\'You must choose an active Cost Element\');

","

create or replace rule \\"_CREATE_CHECK_MATERIAL\\" as on insert to xm.item_cost 
   where (select (count(*) > 0)
	  from itemcost
	  join item i on itemcost_item_id = i.item_id
	  join costelem c on itemcost_costelem_id = c.costelem_id
	  where (c.costelem_type = \'Material\'
	         and i.item_type not in (\'O\', \'P\'))
	   and itemcost_item_id = new.item
	   and itemcost_costelem_id = new.cost_element) do instead

  select private.raise_exception(\'The Material Cost Element may only be associated with Purchased or Outside Processed Items\');

","

create or replace rule \\"_CREATE_CHECK_DUPLICATES\\" as on insert to xm.item_cost 
   where (select (count(*) > 0)
	  from itemcost
	  where ((not itemcost_lowlevel)
	   and (itemcost_item_id = new.item))
	   and itemcost_costelem_id = new.cost_element) do instead

  select private.raise_exception(\'This Item already has all available Costing Elements assigned. No new Item Costs can be created for it until more Costing Elements are defined.\');

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.item_cost
  do instead (

update itemcost set
  itemcost_actcost = new.actual_cost,
  itemcost_updated = current_date,
  itemcost_curr_id = new.currency
where ( itemcost_id = old.guid );

-- if flag is set, post actual cost to std cost
select postcost(new.guid)
where (new.is_post_standard);

)

","

create or replace rule \\"_CREATE_CHECK_ENTERACTUAL\\" as on update to xm.item_cost
   where not checkPrivilege(\'EnterActualCosts\') do instead

  select private.raise_exception(\'You do not have privileges to update Actual Costs\');

","

create or replace rule \\"_CREATE_CHECK_POST\\" as on update to xm.item_cost 
   where (new.is_post_standard)
     and not (checkPrivilege(\'PostActualCosts\')) do instead

  select private.raise_exception(\'You do not have privileges to Post Actual Costs to Standard Costs\');

","

-- delete rule

","

create or replace rule \\"_DELETE\\" as on delete to xm.item_cost
  do instead

delete from itemcost
where (itemcost_id = old.guid);

create or replace rule \\"_CREATE_CHECK_PRIV\\" as on delete to xm.item_cost
   where not checkPrivilege(\'DeleteCosts\') do instead

  select private.raise_exception(\'You do not have privileges to delete Item Costs\');

"}',

-- Conditions, Comment, System, Nested

E'{"checkPrivilege(\'ViewCosts\')"}', 'Item Cost Model', true, true);
