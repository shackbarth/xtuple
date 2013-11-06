select xt.create_view('xt.postproductioninfo', $$

  select   
    wo_id,
    wo_number::text AS wo_number,
    wo_subnumber,
    wo_status,
    wo_itemsite_id,
    itemsite_item_id as wo_item_id,
    itemsite_warehous_id as wo_warehous_id,
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
    wo_username, 
    case when (wo_qtyrcv > wo_qtyord) then 0 else (wo_qtyord - wo_qtyrcv) end AS balance,
    null::numeric AS qty_to_post,
    null::numeric AS undistributed,
    case when (coalesce(wo_cosmethod, '') != 'D' and womatl_wo_id is not null) then true else false end as backflush_materials
  from wo
    join itemsite on wo_itemsite_id = itemsite_id
    left join (select womatl_wo_id from womatl where womatl_issuemethod != 'S' group by womatl_wo_id) as womatl ON wo_id = womatl_wo_id 
  where wo_status != 'C'
  ;

  create or replace rule "_UPDATE" as on update to xt.postproductioninfo do instead

  update wo set
    wo_prodnotes=new.wo_prodnotes
  where wo_id = old.wo_id;

$$, false);