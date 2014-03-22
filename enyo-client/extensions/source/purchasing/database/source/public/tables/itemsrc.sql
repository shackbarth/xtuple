select dropIfExists('TRIGGER', 'itemsrc_vendor_item_number_did_change');

update itemsrc set itemsrc_vend_item_number = item_number
from item where item_id=itemsrc_item_id
and length(itemsrc_vend_item_number) = 0;

update itemsrc set itemsrc_default = false
where itemsrc_default is null;

alter table itemsrc alter column itemsrc_default set not null;

-- add index
select xt.add_index('itemsrc', 'itemsrc_manuf_name', 'itemsrc_manuf_name_index', 'btree', 'public');

-- create trigger
create trigger itemsrc_vendor_item_number_did_change before insert or update on itemsrc for each row execute procedure xt.itemsrc_did_change();
