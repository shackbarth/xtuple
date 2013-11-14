/**
 * Calculate the balance of a XM.CashReceiptReceivable
 * balance = amount - (paid + all unposted)
 *
 * @param {Number}  aropen_id
 */
create or replace function xt.cashrcpt_receivable_balance(numeric) returns numeric stable as $$

  select
    coalesce(
      aropen_amount - (aropen_paid + xt.cashrcpt_receivable_sum_amount(aropen_id, false))
    )

  from aropen where aropen_id = $1


$$ language sql;
