DO $$
  var dropSql = "drop view if exists xt.coiteminfo cascade;";
  var sql = "create or replace view xt.coiteminfo as " +
  "select coitem.*, " +
    "xt.co_line_base_price(coitem) as base_price, " +
    "xt.co_line_list_cost_markup(coitem) as list_cost_markup, " +
    "xt.co_line_list_price(coitem) as list_price, " +
    "xt.co_line_list_price_discount(coitem) as list_price_discount, " +
    "xt.co_line_customer_discount(coitem) as cust_discount, " +
    "xt.co_line_extended_price(coitem) as ext_price, " +
    "xt.co_line_profit(coitem) as profit, " +
    "xt.co_line_tax(coitem) as tax " +
  "from coitem " +
    "left join item on coitem_item_id=item_id; ";

  try {
    plv8.execute(sql);
  } catch (error) {
    /* let's cascade-drop the view and try again */
    plv8.execute(dropSql);
    plv8.execute(sql);
  }

$$ language plv8;
          
revoke all on xt.coiteminfo from public;
grant all on table xt.coiteminfo to group xtrole;

create or replace rule "_INSERT" as on insert to xt.coiteminfo do instead

insert into coitem (
  coitem_id,
  coitem_cohead_id,
  coitem_linenumber,
  coitem_itemsite_id,
  coitem_scheddate,
  coitem_qtyord,
  coitem_unitcost,
  coitem_price,
  coitem_custprice,
  coitem_memo,
  coitem_custpn,
  coitem_prcost,
  coitem_imported,
  coitem_qty_uom_id,
  coitem_qty_invuomratio,
  coitem_price_uom_id,
  coitem_price_invuomratio,
  coitem_promdate,
  coitem_taxtype_id,
  coitem_itemsrc_id,
  coitem_pricemode,
  coitem_order_warehous_id,
  coitem_item_id
) select
  new.coitem_id,
  new.coitem_cohead_id,
  new.coitem_linenumber,
  new.coitem_itemsite_id,
  new.coitem_scheddate,
  new.coitem_qtyord,
  stdcost(item_id),
  new.coitem_price,
  new.coitem_custprice,
  new.coitem_memo,
  new.coitem_custpn,
  new.coitem_prcost,
  new.coitem_imported,
  new.coitem_qty_uom_id,
  new.coitem_qty_invuomratio,
  new.coitem_price_uom_id,
  new.coitem_price_invuomratio,
  new.coitem_promdate,
  new.coitem_taxtype_id,
  new.coitem_itemsrc_id,
  new.coitem_pricemode,
  warehous_id,
  item_id
from itemsite
  join item on item_id=itemsite_item_id
  join whsinfo on warehous_id=itemsite_warehous_id
where itemsite_id=new.coitem_itemsite_id;

create or replace rule "_UPDATE" as on update to xt.coiteminfo do instead

update coitem set
  coitem_id=new.coitem_id,
  coitem_cohead_id=new.coitem_cohead_id,
  coitem_linenumber=new.coitem_linenumber,
  coitem_scheddate=new.coitem_scheddate,
  coitem_qtyord=new.coitem_qtyord,
  coitem_price=new.coitem_price,
  coitem_custprice=new.coitem_custprice,
  coitem_memo=new.coitem_memo,
  coitem_custpn=new.coitem_custpn,
  coitem_prcost=new.coitem_prcost,
  coitem_imported=new.coitem_imported,
  coitem_qty_uom_id=new.coitem_qty_uom_id,
  coitem_qty_invuomratio=new.coitem_qty_invuomratio,
  coitem_price_uom_id=new.coitem_price_uom_id,
  coitem_price_invuomratio=new.coitem_price_invuomratio,
  coitem_promdate=new.coitem_promdate,
  coitem_taxtype_id=new.coitem_taxtype_id,
  coitem_itemsrc_id=new.coitem_itemsrc_id,
  coitem_pricemode=new.coitem_pricemode
where coitem_id = old.coitem_id;

create or replace rule "_DELETE" as on delete to xt.coiteminfo do instead

delete from coitem where coitem_id = old.coitem_id;
