select xt.create_view('xt.woinfo', $$

select wo.*, 
    case when (wo_qtyrcv > wo_qtyord) then 0 else (wo_qtyord - wo_qtyrcv) end AS balance,
    null::numeric AS qty_to_post
  from wo;

$$, false);

create or replace rule "_INSERT" as on insert to xt.woinfo do instead

insert into wo (
  wo_id,
  wo_number,
  wo_subnumber,
  wo_status,
  wo_itemsite_id,
  wo_startdate,
  wo_duedate,
  wo_ordtype,
  wo_ordid,
  wo_qtyord,
  wo_qtyrcv,
  wo_adhoc,
  wo_itemcfg_series,
  wo_imported,
  wo_wipvalue,
  wo_postedvalue,
  wo_prodnotes,
  wo_prj_id,
  wo_priority,
  wo_brdvalue,
  wo_bom_rev_id,
  wo_boo_rev_id,
  wo_cosmethod,
  wo_womatl_id,
  wo_username
) values (
  new.wo_id ,
  new.wo_number,
  new.wo_subnumber,
  new.wo_status,
  new.wo_itemsite_id,
  new.wo_startdate,
  new.wo_duedate,
  new.wo_ordtype,
  new.wo_ordid,
  new.wo_qtyord,
  new.wo_qtyrcv,
  new.wo_adhoc,
  new.wo_itemcfg_series,
  new.wo_imported,
  new.wo_wipvalue,
  new.wo_postedvalue,
  new.wo_prodnotes,
  new.wo_prj_id,
  new.wo_priority,
  new.wo_brdvalue,
  new.wo_bom_rev_id,
  new.wo_boo_rev_id,
  new.wo_cosmethod,
  new.wo_womatl_id,
  new.wo_username
);

create or replace rule "_UPDATE" as on update to xt.woinfo do instead

update wo set
  wo_id = new.wo_id,
  wo_number = new.wo_number,
  wo_subnumber = new.wo_subnumber,
  wo_status = new.wo_status,
  wo_itemsite_id = new.wo_itemsite_id,
  wo_startdate = new.wo_startdate,
  wo_duedate = new.wo_duedate,
  wo_ordtype = new.wo_ordtype,
  wo_ordid = new.wo_ordid,
  wo_qtyord = new.wo_qtyord,
  wo_qtyrcv = new.wo_qtyrcv,
  wo_adhoc = new.wo_adhoc,
  wo_itemcfg_series = new.wo_itemcfg_series,
  wo_imported = new.wo_imported,
  wo_wipvalue = new.wo_wipvalue,
  wo_postedvalue = new.wo_postedvalue,
  wo_prodnotes = new.wo_prodnotes,
  wo_prj_id = new.wo_prj_id,
  wo_priority = new.wo_priority,
  wo_brdvalue = new.wo_brdvalue,
  wo_bom_rev_id = new.wo_bom_rev_id,
  wo_boo_rev_id = new.wo_boo_rev_id,
  wo_cosmethod = new.wo_cosmethod,
  wo_womatl_id = new.wo_womatl_id,
  wo_username = new.wo_username
where wo_id = old.wo_id;

create or replace rule "_DELETE" as on delete to xt.woinfo do instead

select deletewo(old.wo_id, true);
