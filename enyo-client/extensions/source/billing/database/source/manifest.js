{
  "name": "billing",
  "comment": "Billing extension",
  "loadOrder": 30,
  "databaseScripts": [
    "xm/javascript/billing.sql",
    "xm/javascript/sales_category.sql",
    "xt/views/receivable_invoice_return.sql",
    "xt/views/aropeninfo.sql",
    "xt/functions/cashrcpt_sum_pending.sql",
    "xt/functions/cashrcpt_balance.sql",
    "xt/views/cashrcptitem_pending.sql",
    "xt/views/cashrcpt_receivable.sql"
  ]
}
