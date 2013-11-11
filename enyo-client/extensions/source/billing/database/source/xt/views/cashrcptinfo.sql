/**
 * @alias XM.CashReceipt
 * 
 * Returns a CashReceipt with its appliedAmount and balance pre-calculated.
 */
select xt.create_view('xt.cashrcptinfo', $$

  select
    cashrcpt_id,
    cashrcpt_number       as number,
    cashrcpt_docnumber    as docnumber,
    cashrcpt_cust_id      as cust_id,
    cashrcpt_docdate      as docdate,
    cashrcpt_distdate     as distdate,
    cashrcpt_applydate    as applydate,
    cashrcpt_bankaccnt_id as bankaccnt_id,
    cashrcpt_fundstype    as fundstype,
    cashrcpt_discount     as discount,
    cashrcpt_curr_id      as curr_id,
    cashrcpt_curr_rate    as curr_rate,
    cashrcpt_amount       as amount,
    cashrcpt_notes        as notes,
    cashrcpt_posted       as posted,
    cashrcpt_usecustdeposit as usecustdeposit,

    xt.cashrcpt_applied_amount(cashrcpt_id, true) as applied_amount,
    coalesce(amount - applied_amount, 0)          as balance

  from cashrcpt;

$$);
