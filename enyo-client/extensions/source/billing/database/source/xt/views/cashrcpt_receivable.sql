/**
 * @alias XM.CashReceiptReceivable
 * 
 * Returns a CashReceiptReceivable with its pending receipts and balance pre-calculated.
 */
select xt.create_view('xt.cashrcpt_receivable', $$

  select
    aropen_id,
    cashrcptitem_id,
    cashrcptitem_cashrcpt_id,
    cashrcpt_id,
    cashrcpt_cust_id,
    cashrcpt_posted,
    aropen.obj_uuid    as obj_uuid,
    aropen_cust_id     as cust_id,
    aropen_doctype     as doctype,
    aropen_docnumber   as docnumber,
    aropen_ordernumber as ordernumber,
    aropen_docdate     as docdate,
    aropen_duedate     as duedate,
    aropen_curr_id     as curr_id,
    aropen_open        as open,
    aropen_paid        as applied_amount,
    aropen_amount      as amount,
    cashrcptitem_discount as discount,

    xt.cashrcpt_receivable_sum_amount(aropen.aropen_id, false)  as all_pending,
    xt.cashrcpt_receivable_balance(aropen.aropen_id)            as balance

  from
    cashrcpt
    left join cashrcptitem  on (cashrcpt_id = cashrcptitem_cashrcpt_id)
    left join aropen        on (cashrcptitem_aropen_id = aropen_id);

$$);
