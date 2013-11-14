/**
 * @alias XM.CashReceiptLinePending
 * Return only XM.CashReceiptLine items that are pending, i.e.
 * applied = false.
 */
select xt.create_view('xt.cashrcptitem_pending', $$

  select
    obj_uuid                as uuid,
    cashrcptitem_id         as id,
    cashrcptitem_amount     as amount,
    cashrcptitem_discount   as discountAmount,
    cashrcptitem_aropen_id  as


    
    
  from
    cashrcptitem
  
  where
    cashrcptitem_applied = false;

$$);
