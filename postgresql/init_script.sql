-- [ START ] initdb

-- create schemas
\i create_private_schema.sql;
\i create_xm_schema.sql;

-- create languages
\i create_plv8.sql;

-- [ END ] initdb

-- [ START ] core

-- core/global functions
\i core/global/private/functions/add_column.sql;
\i core/global/private/functions/add_constraint.sql;
\i core/global/private/functions/add_primary_key.sql;
\i core/global/private/functions/any_numeric.sql;
\i core/global/private/functions/any_text.sql;
\i core/global/private/functions/commit_record.sql;
\i core/global/private/functions/create_table.sql;
\i core/global/private/functions/create_orm_view.sql;
\i core/global/private/functions/drop_orm_view.sql;
\i core/global/private/functions/ends_with.sql;
\i core/global/private/functions/execute_query.sql;
\i core/global/private/functions/extend_model.sql;
\i core/global/private/functions/fetch.sql;
\i core/global/private/functions/get_id.sql;
\i core/global/private/functions/install_orm.sql;
\i core/global/private/functions/is_date.sql;
\i core/global/private/functions/raise_exception.sql;
\i core/global/private/functions/retrieve_record.sql;
\i core/global/private/functions/starts_with.sql;
\i core/global/private/functions/text_gt_date.sql;
\i core/global/private/functions/text_lt_date.sql;
\i core/global/private/functions/validate_user.sql;
\i core/global/private/functions/session_privileges.sql;
\i core/global/private/functions/session_metrics.sql;
\i core/global/private/functions/session_locale.sql;

-- core/trigger functions
\i core/global/private/trigger_functions/orm_did_change.sql

-- core/global tables
\i core/global/private/tables/orm.sql

-- core/operators
\i core/global/private/operators/any_numeric.sql;
\i core/global/private/operators/any_text.sql;
\i core/global/private/operators/ends_with.sql;
\i core/global/private/operators/starts_with.sql;
\i core/global/private/operators/text_gt_date.sql;
\i core/global/private/operators/text_lt_date.sql;

-- core/user_account triggers
\i core/user_account/private/trigger_functions/useracct_duplicate_check.sql;

-- core/user_account tables
\i core/user_account/private/tables/useracct.sql;

-- core/user_account views
\i core/user_account/private/views/usr.sql;

-- core/global/xm/functions
\i core/global/xm/functions/dispatch.sql;
\i core/global/xm/functions/fetch_number.sql;
\i core/global/xm/functions/fetch_id.sql;

-- core/document xm views
\i core/document/private/views/docinfo.sql; 

-- core/global/xm/functions
\i core/global/xm/functions/fetch_number.sql;
\i core/global/xm/functions/fetch_id.sql;

-- core/comment/private
\i core/comment/private/comment.sql; 

-- [ END ] core
