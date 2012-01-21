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
\i core/global/private/functions/create_model.sql;
\i core/global/private/functions/create_table.sql;
\i core/global/private/functions/create_xm_view.sql;
\i core/global/private/functions/drop_xm_view.sql;
\i core/global/private/functions/ends_with.sql;
\i core/global/private/functions/execute_query.sql;
\i core/global/private/functions/extend_model.sql;
\i core/global/private/functions/fetch.sql;
\i core/global/private/functions/get_id.sql;
\i core/global/private/functions/raise_exception.sql;
\i core/global/private/functions/retrieve_record.sql;
\i core/global/private/functions/starts_with.sql;

-- core/trigger functions
\i core/global/private/trigger_functions/model_changed.sql

-- core/global tables
\i core/global/private/tables/model.sql
\i core/global/private/tables/modelext.sql
\i core/global/private/tables/nested.sql

-- core/operators
\i core/global/private/operators/any_numeric.sql;
\i core/global/private/operators/any_text.sql;
\i core/global/private/operators/ends_with.sql;
\i core/global/private/operators/starts_with.sql;

-- core/type tables
\i core/type/private/tables/datatype.sql;

-- core/type functions
\i core/type/private/functions/get_datatype_source.sql;

-- core/type xm views
\i core/type/xm/models/type.sql;

-- core/user_account triggers
\i core/user_account/private/trigger_functions/user_duplicate_check.sql;

-- core/user_account tables
\i core/user_account/private/tables/datatype.sql;
\i core/user_account/private/tables/user.sql;

-- core/user_account xm models
\i core/user_account/xm/models/user_account_info.sql;
\i core/user_account/xm/models/privilege.sql;
\i core/user_account/xm/models/language.sql;
\i core/user_account/xm/models/locale.sql;
\i core/user_account/xm/models/user_account.sql;

-- core/characteristic xm models
\i core/characteristic/xm/models/characteristic.sql;
\i core/characteristic/xm/models/characteristic_option.sql;

-- core/comment xm views
\i core/comment/xm/models/comment.sql;
\i core/comment/xm/models/comment_type.sql;

-- core/document
\i core/document/private/datatype.sql;

-- core/document xm views
\i core/document/xm/models/document_assignment.sql;
\i core/document/xm/models/file.sql;
\i core/document/xm/models/image.sql;
\i core/document/xm/models/url.sql;

-- core/address xm functions
\i core/address/xm/functions/address_find_existing.sql;
\i core/address/xm/functions/address_use_count.sql;

-- core/address tables
\i core/address/private/tables/datatype.sql;

-- core/address xm models
\i core/address/xm/models/address_characteristic.sql;
\i core/address/xm/models/address_comment.sql;
\i core/address/xm/models/state.sql;
\i core/address/xm/models/country.sql;
\i core/address/xm/models/address.sql;
\i core/address/xm/models/address_info.sql;

-- core/contact tables
\i core/contact/private/tables/datatype.sql;

-- core/contact xm models
\i core/contact/xm/models/contact_info.sql;
\i core/contact/xm/models/contact_characteristic.sql;
\i core/contact/xm/models/contact_comment.sql;
\i core/contact/xm/models/contact_document.sql;
\i core/contact/xm/models/contact_email.sql;
\i core/contact/xm/models/honorific.sql;
\i core/contact/xm/models/contact.sql;

-- core/currency xm views
\i core/currency/xm/models/currency_rate.sql;
\i core/currency/xm/models/currency.sql;
\i core/item/private/tables/datatype.sql;

-- core/item xm views
\i core/item/xm/models/item_alias.sql; 
\i core/item/xm/models/item_characteristic.sql;
\i core/item/xm/models/item_comment.sql;
\i core/item/xm/models/item_conversion.sql;
\i core/item/xm/models/item_conversion_type_assignment.sql;
\i core/item/xm/models/item_document.sql;
\i core/item/xm/models/item_info.sql;
\i core/item/xm/models/item_substitute.sql;
\i core/item/xm/models/item_cost.sql;
\i core/item/xm/models/item.sql;

-- core/priority xm views 
\i core/priority/xm/models/priority.sql;

-- core/site xm models 
\i core/site/xm/models/site_comment.sql;
\i core/site/xm/models/site_type.sql;
\i core/site/xm/models/site_zone.sql;
\i core/site/xm/models/site_info.sql;
\i core/site/xm/models/site.sql;

-- core/unit xm models
\i core/unit/xm/models/unit.sql;
\i core/unit/xm/models/unit_conversion.sql;
-- [ END ] core

-- [ START ] business
-- business/account tables
\i business/account/private/tables/datatype.sql;

-- business/account xm models
\i business/account/xm/models/account_info.sql;
\i business/account/xm/models/account_characteristic.sql;
\i business/account/xm/models/account_comment.sql;
\i business/account/xm/models/account_document.sql;
\i business/account/xm/models/account.sql;

-- business/account/incident tables
\i business/account/incident/private/tables/datatype.sql;

-- business/account/incident xm models
\i business/account/incident/xm/models/incident_alarm.sql;
\i business/account/incident/xm/models/incident_category.sql;
\i business/account/incident/xm/models/incident_characteristic.sql;
\i business/account/incident/xm/models/incident_comment.sql;
\i business/account/incident/xm/models/incident_history.sql;
\i business/account/incident/xm/models/incident_info.sql;
\i business/account/incident/xm/models/incident_resolution.sql;
\i business/account/incident/xm/models/incident_severity.sql;
\i business/account/incident/xm/models/incident.sql;

-- business/account/opportunity tables
\i business/account/opportunity/private/tables/datatype.sql;

-- business/account/opportunity xm models
\i business/account/opportunity/xm/models/opportunity_characteristic.sql;
\i business/account/opportunity/xm/models/opportunity_comment.sql;
\i business/account/opportunity/xm/models/opportunity_info.sql;
\i business/account/opportunity/xm/models/opportunity_source.sql;
\i business/account/opportunity/xm/models/opportunity_stage.sql;
\i business/account/opportunity/xm/models/opportunity_type.sql;
\i business/account/opportunity/xm/models/opportunity.sql;

-- business/customer tables
\i business/customer/private/tables/datatype.sql;

-- business/employee tables
\i business/employee/private/tables/datatype.sql;

-- business/project xm models
\i business/project/xm/models/project_comment.sql;
\i business/project/xm/models/project_document.sql;
\i business/project/xm/models/project_info.sql;
\i business/project/xm/models/project_task_alarm.sql;
\i business/project/xm/models/project_task_comment.sql;
\i business/project/xm/models/project_task.sql;
\i business/project/xm/models/project.sql;

-- business/to_do tables
\i business/to_do/private/tables/datatype.sql;

-- business/todo xm models
\i business/todo/xm/models/todo_alarm.sql;
\i business/todo/xm/models/todo_comment.sql;
\i business/todo/xm/models/todo_document.sql;
\i business/todo/xm/models/todo_info.sql;
\i business/todo/xm/models/todo.sql;

-- [ END ] business
