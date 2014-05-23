{
  "name": "billing",
  "comment": "Billing extension",
  "loadOrder": 30,
  "databaseScripts": [
    "xt/tables/rptdef.sql",
    "xm/javascript/billing.sql",
    "xm/javascript/cashrcpt.sql",
    "xm/javascript/invoice.sql",
    "xm/javascript/return.sql",
    "xm/javascript/receivable.sql",
    "xm/javascript/sales_category.sql",
    "xt/functions/ar_balance.sql",
    "xt/functions/ar_tax_total.sql",
    "xt/functions/cashrcpt.sql",
    "xt/views/receivable_invoice_return.sql",
    "xt/views/aropeninfo.sql",
    "xt/views/receivable_applications.sql",
    "xt/views/share_users_invchead.sql",
    "xt/views/cashrcpt.sql",
    "xt/tables/sharetype.sql"
  ]
}
