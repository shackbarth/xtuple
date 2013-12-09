select xt.create_view('xt.cmiteminfo', $$

select cmitem.*,
  itemsite_item_id as cmitem_item_id,
  itemsite_warehous_id as cmitem_warehous_id,
from cmitem
  join itemsite on cmitem_itemsite_id = itemsite_id;

$$, false);

create or replace rule "_INSERT" as on insert to xt.cmiteminfo do instead

--from itemsite
--where itemsite_item_id=new.cmitem_item_id
--  and itemsite_warehous_id=new.cmitem_warehous_id;

create or replace rule "_UPDATE" as on update to xt.cmiteminfo do instead


create or replace rule "_DELETE" as on delete to xt.cmiteminfo do instead

delete from cmitem where cmitem_id = old.cmitem_id;

