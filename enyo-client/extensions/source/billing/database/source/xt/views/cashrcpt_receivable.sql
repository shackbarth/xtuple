select xt.create_view('xt.cashrcpt_receivable', $$

  select
    aropen_id,
    aropen.obj_uuid    as obj_uuid,
    aropen_cust_id     as cust_id,
    aropen_doctype     as doctype,
    aropen_docnumber   as docnumber,
    aropen_ordernumber as ordernumber,
    aropen_docdate     as docdate,
    aropen_duedate     as duedate,
    aropen_curr_id     as curr_id,
    aropen_open        as open,
    aropen_paid        as paid,
    aropen_amount      as amount,

    xt.cashrcpt_sum_pending(cashrcpt) as pending,
    xt.cashrcpt_balance(cashrcpt)     as balance

  from
    cashrcpt
    left join cashrcptitem  on (cashrcpt_id = cashrcptitem_cashrcpt_id)
    left join aropen        on (cashrcptitem_aropen_id = aropen_id)
  ;

$$);
