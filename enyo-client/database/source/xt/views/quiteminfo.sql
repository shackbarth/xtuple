drop view if exists xt.quiteminfo cascade;

create or replace view xt.quiteminfo as

  select quitem.*,
    item_listcost as list_cost,
    xt.quote_line_list_cost_markup(quitem) as list_cost_markup,
    xt.quote_line_list_price(quitem) as list_price,
    xt.quote_line_list_price_discount(quitem) as list_price_discount,
    xt.quote_line_customer_discount(quitem) as cust_discount,
    xt.quote_line_extended_price(quitem) as ext_price,
    xt.quote_line_profit(quitem) as profit,
    xt.quote_line_tax(quitem) as tax
  from quitem
    left join item on quitem_item_id=item_id;
          
revoke all on xt.quiteminfo from public;
grant all on table xt.quiteminfo to group xtrole;

create or replace rule "_INSERT" as on insert to xt.quiteminfo do instead

insert into quitem (
  quitem_id,
  quitem_quhead_id,
  quitem_linenumber,
  quitem_itemsite_id,
  quitem_scheddate,
  quitem_qtyord,
  quitem_unitcost,
  quitem_price,
  quitem_custprice,
  quitem_memo,
  quitem_custpn,
  quitem_createorder,
  quitem_order_warehous_id,
  quitem_item_id,
  quitem_prcost,
  quitem_imported,
  quitem_qty_uom_id,
  quitem_qty_invuomratio,
  quitem_price_uom_id,
  quitem_price_invuomratio,
  quitem_promdate,
  quitem_taxtype_id,
  quitem_dropship,
  quitem_itemsrc_id,
  quitem_pricemode
) values (
  new.quitem_id,
  new.quitem_quhead_id,
  new.quitem_linenumber,
  new.quitem_itemsite_id,
  new.quitem_scheddate,
  new.quitem_qtyord,
  new.quitem_unitcost,
  new.quitem_price,
  new.quitem_custprice,
  new.quitem_memo,
  new.quitem_custpn,
  new.quitem_createorder,
  new.quitem_order_warehous_id,
  new.quitem_item_id,
  new.quitem_prcost,
  new.quitem_imported,
  new.quitem_qty_uom_id,
  new.quitem_qty_invuomratio,
  new.quitem_price_uom_id,
  new.quitem_price_invuomratio,
  new.quitem_promdate,
  new.quitem_taxtype_id,
  new.quitem_dropship,
  new.quitem_itemsrc_id,
  new.quitem_pricemode
);

create or replace rule "_UPDATE" as on update to xt.quiteminfo do instead

update quitem set
  quitem_id=new.quitem_id,
  quitem_quhead_id=new.quitem_quhead_id,
  quitem_linenumber=new.quitem_linenumber,
  quitem_itemsite_id=new.quitem_itemsite_id,
  quitem_scheddate=new.quitem_scheddate,
  quitem_qtyord=new.quitem_qtyord,
  quitem_unitcost=new.quitem_unitcost,
  quitem_price=new.quitem_price,
  quitem_custprice=new.quitem_custprice,
  quitem_memo=new.quitem_memo,
  quitem_custpn=new.quitem_custpn,
  quitem_createorder=new.quitem_createorder,
  quitem_order_warehous_id=new.quitem_order_warehous_id,
  quitem_item_id=new.quitem_item_id,
  quitem_prcost=new.quitem_prcost,
  quitem_imported=new.quitem_imported,
  quitem_qty_uom_id=new.quitem_qty_uom_id,
  quitem_qty_invuomratio=new.quitem_qty_invuomratio,
  quitem_price_uom_id=new.quitem_price_uom_id,
  quitem_price_invuomratio=new.quitem_price_invuomratio,
  quitem_promdate=new.quitem_promdate,
  quitem_taxtype_id=new.quitem_taxtype_id,
  quitem_dropship=new.quitem_dropship,
  quitem_itemsrc_id=new.quitem_itemsrc_id,
  quitem_pricemode=new.quitem_pricemode
where quitem_id = old.quitem_id;

create or replace rule "_DELETE" as on delete to xt.quiteminfo do instead

delete from quitem where quitem_id = old.quitem_id;