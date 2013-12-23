/**
 * @alias XM.CashReceiptAllocation
 * @extends XM.CashReceiptLine, XM.ReceivableAllocation
 *
 * Return CashReceiptLines that have been allocated to a Document or any other
 * domain object that is into that sort of thing, e.g. SalesOrder. This allows
 * CashReceiptLine to be queried by the Document it has been allocated to.
 */
select xt.create_view('xt.cashrcpt_allocation', $$

  select
    aropenalloc.obj_uuid  as aropenalloc_uuid,
    aropen.obj_uuid       as aropen_uuid,
    cashrcptitem.obj_uuid as cashrcptitem_uuid,
    aropenalloc_doc_id,
    aropenalloc_doctype,
    aropenalloc_aropen_id,
    aropenalloc_amount,
    aropenalloc_curr_id,
    cashrcptitem_aropen_id,
    cashrcptitem_cashrcpt_id

  from
    aropen
    left join aropenalloc on (aropen_id = aropenalloc_aropen_id)
    left join cashrcptitem on (aropenalloc_aropen_id = cashrcptitem_aropen_id)
    left join cashrcpt on (cashrcptitem_cashrcpt_id = cashrcpt_id)

$$);

/**
 * @alias XM.CashReceiptLinePending
 *
 * Return only XM.CashReceiptLine items that are pending, i.e.
 * cashrcpt_posted = false.
 */
select xt.create_view('xt.cashrcptitem_pending', $$

  select *
    
  from
    cashrcptitem
    inner join cashrcpt on (cashrcptitem_cashrcpt_id = cashrcpt_id)
  
  where
    not cashrcpt_posted;

$$);
