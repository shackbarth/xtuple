-- [ START ] initdb

-- create schemas
\i create_xt_schema.sql;
\i create_xm_schema.sql;

-- drop xm views
\i drop_xm_views.sql;

-- create languages
\i create_plv8.sql;

-- [ END ] initdb

-- [ START ] xt

-- xt functions
\i xt/functions/add_column.sql;
\i xt/functions/add_constraint.sql;
\i xt/functions/add_primary_key.sql;
\i xt/functions/any_numeric.sql;
\i xt/functions/any_text.sql;
\i xt/functions/commit_record.sql;
\i xt/functions/create_table.sql;
\i xt/functions/dispatch.sql;
\i xt/functions/ends_with.sql;
\i xt/functions/execute_query.sql;
\i xt/functions/fetch.sql;
\i xt/functions/get_id.sql;
\i xt/functions/js_init.sql;
\i xt/functions/install_js.sql;
\i xt/functions/install_orm.sql;
\i xt/functions/is_date.sql;
\i xt/functions/raise_exception.sql;
\i xt/functions/retrieve_record.sql;
\i xt/functions/starts_with.sql;
\i xt/functions/text_gt_date.sql;
\i xt/functions/text_lt_date.sql;
\i xt/functions/validate_user.sql;

-- xt trigger functions
\i xt/trigger_functions/orm_did_change.sql
\i xt/trigger_functions/comment_did_change.sql
\i xt/trigger_functions/useracct_duplicate_check.sql

-- xt operators
\i xt/operators/any_numeric.sql;
\i xt/operators/any_text.sql;
\i xt/operators/ends_with.sql;
\i xt/operators/starts_with.sql;
\i xt/operators/text_gt_date.sql;
\i xt/operators/text_lt_date.sql;

-- xt tables
\i xt/tables/comment.sql
\i xt/tables/js.sql
\i xt/tables/orm.sql
\i xt/tables/useracct.sql

-- xt javascript
\i xt/javascript/data.sql;
\i xt/javascript/orm.sql;
\i xt/javascript/record.sql;
\i xt/javascript/session.sql;

-- xt views
\i xt/views/apapply.sql;
\i xt/views/arapply.sql;
\i xt/views/aropencr.sql;
\i xt/views/aropenid.sql;
\i xt/views/arpending.sql;
\i xt/views/docinfo.sql; 
\i xt/views/gl.sql;
\i xt/views/invcheadtaxadj.sql;
\i xt/views/jrnl.sql;
\i xt/views/unrec.sql;
\i xt/views/usr.sql;

-- delete system orms
\i delete_system_orms.sql;

-- [ END ] xt

-- [ START ] xm

-- xm/javascript
\i xm/javascript/address.sql;
\i xm/javascript/bank_account_reconciliation.sql;
\i xm/javascript/cash_receipt.sql;
\i xm/javascript/cash_distribution_journal.sql;
\i xm/javascript/cash_receipt_journal.sql;
\i xm/javascript/contact.sql;
\i xm/javascript/crm.sql;
\i xm/javascript/customer.sql;
\i xm/javascript/database_information.sql;
\i xm/javascript/fiscal_year.sql;
\i xm/javascript/general_journal.sql;
\i xm/javascript/general_ledger.sql;
\i xm/javascript/incident.sql;
\i xm/javascript/invoice.sql;
\i xm/javascript/invoice_line.sql;
\i xm/javascript/item.sql;
\i xm/javascript/journal.sql;
\i xm/javascript/ledger_account.sql;
\i xm/javascript/payable.sql;
\i xm/javascript/payables.sql;
\i xm/javascript/payment.sql;
\i xm/javascript/period.sql;
\i xm/javascript/project.sql;
\i xm/javascript/purchase_journal.sql;
\i xm/javascript/receivable.sql;
\i xm/javascript/receivables.sql;
\i xm/javascript/sales_journal.sql;
\i xm/javascript/standard_journal.sql;
\i xm/javascript/tax.sql;
\i xm/javascript/to_do.sql;
-- [ END ] xm
