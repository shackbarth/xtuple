select dropIfExists('TRIGGER', 'itemsrc_did_change', 'xt');

update itemsrc set itemsrc_vend_item_number = item_number
from item where item_id=itemsrc_item_id
and length(itemsrc_vend_item_number) = 0;

-- create trigger

create trigger itemsrc_vendor_item_number_did_change before insert or update on itemsrc for each row execute procedure xt.itemsrc_did_change();