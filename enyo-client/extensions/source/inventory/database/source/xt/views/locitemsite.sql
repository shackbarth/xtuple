select xt.create_view('xt.locitemsite', $$

select locitem_id as locitemsite_id,
  locitem_location_id as locitemsite_location_id,
  itemsite_id as locitemsite_itemsite_id,
  locitem.obj_uuid as obj_uuid
from locitem
  join location on locitem_location_id=location_id
  join itemsite on locitem_item_id=itemsite_item_id
where itemsite_warehous_id=location_warehous_id;

$$, false);

create or replace rule "_INSERT" as on insert to xt.locitemsite do instead

insert into locitem (
  locitem_id,
  locitem_location_id,
  locitem_item_id,
  obj_uuid
) select
  new.locitemsite_id,
  new.locitemsite_location_id,
  itemsite_item_id,
  new.obj_uuid
from itemsite
where itemsite_id=new.locitemsite_itemsite_id;

create or replace rule "_UPDATE" as on update to xt.locitemsite do instead

nothing;

create or replace rule "_DELETE" as on delete to xt.locitemsite do instead

delete from locitem where locitem_id = old.locitemsite_id;
