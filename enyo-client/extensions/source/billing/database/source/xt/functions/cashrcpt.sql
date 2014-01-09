/**
 * @method cashrcpt_applied_amount
 *
 * Aggregate the cash receipt line amounts. CashReceiptLine and CashReceipt
 * currencies should match, so no explicit conversion occurs here.
 *
 * @param {Integer} cashrcpt_id
 * @param {Boolean} whether to aggregate applied or un-applied amounts
 * @returns sum of CashReceiptLine amounts for this CashReceipt
 */
create or replace function xt.cashrcpt_applied_amount(numeric, boolean)
returns numeric stable as $$

  select
    coalesce(sum(cashrcptitem_amount), 0)

  from
    cashrcptitem

  where
    cashrcptitem_cashrcpt_id = $1 and
    cashrcptitem_applied = $2;

$$ language sql;

/**
 * @method cashrcpt_balance
 *
 * Calculate the balance of a XM.CashReceipt
 * balance = amount - applied
 *
 * @param {Integer} cashrcpt_id
 * @param {Number}  amount
 */
create or replace function xt.cashrcpt_balance(numeric, numeric)
returns numeric stable as $$

  select coalesce($2 - xt.cashrcpt_applied_amount($1, true), 0);

$$ language sql;

/**
 * @method cashrcpt_balance
 *
 * Aggregate the cash receipt line amounts; it is necessary to convert the
 * amount of each CashReceiptLine to the currency of the CashReceiptReceivable.
 *
 * @param {Integer} aropen_id
 * @param {Boolean} whether to aggregate applied or un-applied amounts
 * @returns sum of CashReceiptLine amounts for this CashReceiptReceivable
 */
create or replace function xt.cashrcpt_receivable_sum_amount(numeric, boolean)
returns numeric stable as $$

  select
    coalesce(
      -- aggregate CashReceiptLine amounts
      sum(
        -- convert CashReceiptLine currency to that of CashReceiptReceivable
        currtocurr(
          cashrcpt_curr_id,
          aropen_curr_id,
          cashrcptitem_amount,
          cashrcpt_distdate
        )
      ), 0
    )

  from
    aropen 
    inner join cashrcptitem on (aropen_id = cashrcptitem_aropen_id)
    inner join cashrcpt on (cashrcptitem_cashrcpt_id = cashrcpt_id)

  where
    aropen_id = $1 and
    cashrcptitem_applied = $2

$$ language sql;

/**
 * @method cashrcpt_receivable_balance
 *
 * Calculate the balance of a XM.CashReceiptReceivable
 * balance = amount - (paid + all unposted)
 *
 * @param {Number}  aropen_id
 */
create or replace function xt.cashrcpt_receivable_balance(numeric)
returns numeric stable as $$

  select
    coalesce(
      aropen_amount - (aropen_paid + xt.cashrcpt_receivable_sum_amount(aropen_id, false))
    )

  from aropen where aropen_id = $1;

$$ language sql;
