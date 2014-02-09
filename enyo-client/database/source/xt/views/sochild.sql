-- This thing would need to be re-written as a self generating
-- union query like 'xt.act' and 'xt.ordhead' to be truly extensible.

select xt.create_view('xt.sochild', $$

  -- PURCHASE REQUEST
  select
    pr_id as sochild_id,
    sordtype_code as sochild_type,
    pr.obj_uuid as sochild_uuid,
    pr.obj_uuid::text as sochild_key,
    pr_number::text || '-' || pr_subnumber as sochild_number,
    pr_status as sochild_status,
    pr_duedate as sochild_duedate,
    pr_qtyreq as sochild_qty
  from pr
    join pg_class c on pr.tableoid = c.oid
    join xt.sordtype on sordtype_tblname=relname

  union all

  -- PURCHASE ORDER LINE
  select
    poitem_id as sochild_id,
    sordtype_code as sochild_type,
    poitem.obj_uuid as sochild_uuid,
    pohead_number as sochild_key,
    pohead_number || '-' || poitem_linenumber::text as sochild_number,
    poitem_status as sochild_status,
    poitem_duedate as sochild_duedate,
    poitem_qty_ordered as sochild_qty
  from poitem
    join pohead on pohead_id=poitem_pohead_id
    join pg_class c on poitem.tableoid = c.oid
    join xt.sordtype on sordtype_tblname=relname

  union all

  -- WORK ORDER
  select
    wo_id,
    sordtype_code,
    obj_uuid as ord_uuid,
    obj_uuid::text as sochild_key,
    formatwonumber(wo_id),
    wo_status as sochild_status,
    wo_duedate as sochild_duedate,
    wo_qtyord as sochild_qty
  from wo
    join pg_class c on wo.tableoid = c.oid
    join xt.sordtype on sordtype_tblname=relname

$$);
