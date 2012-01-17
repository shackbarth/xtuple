-- [ START ] schema
-- create schema 
	-- private and xm
\i create_private_schema.sql;
\! sleep 1;
\i create_xm_schema.sql;
\! sleep 2;
-- [ END ] schema

-- [ START ] core
-- core/global functions
\i core/global/private/functions/add_column.sql;
\! sleep 1;
\i core/global/private/functions/add_constraint.sql;
\! sleep 1;
\i core/global/private/functions/add_primary_key.sql;
\! sleep 1;
\i core/global/private/functions/commit_changeset.sql;
\! sleep 1;
\i core/global/private/functions/create_model.sql;
\! sleep 1;
\i core/global/private/functions/create_table.sql;
\! sleep 1;
\i core/global/private/functions/create_xm_view.sql;
\! sleep 1;
\i core/global/private/functions/drop_xm_view.sql;
\! sleep 1;
\i core/global/private/functions/execute_query.sql;
\! sleep 1;
\i core/global/private/functions/extend_model.sql;
\! sleep 1;
\i core/global/private/functions/find_views.sql;
\! sleep 1;
\i core/global/private/functions/get_datatype_source.sql;
\! sleep 1;
\i core/global/private/functions/get_id.sql;
\! sleep 1;
-- core/trigger functions
\i core/global/private/trigger_functions/model_changed.sql
\! sleep 1;
-- core/global tables
\i core/global/private/tables/model.sql
\! sleep 1;
\i core/global/private/tables/modelext.sql

\! sleep 2;
-- core/type tables
\i core/type/private/tables/datatype.sql;
\! sleep 1;
-- core/type xm views
\i core/type/xm/views/type.sql;
\! sleep 2;
-- core/characteristic xm models
\i core/characteristic/xm/models/characteristic.sql;
\! sleep 1;
\i core/characteristic/xm/models/characteristic_option.sql;
\! sleep 1;
-- core/document
\i core/document/private/datatype.sql;
\! sleep 1;
-- core/document xm views
\i core/document/xm/views/document_assignment.sql;
\! sleep 1;
\i core/document/xm/views/file.sql;
\! sleep 1;
\i core/document/xm/views/image.sql;
\! sleep 1;
\i core/document/xm/views/url.sql;
\! sleep 2;
-- core/address xm functions
\i core/address/xm/functions/address_find_existing.sql;
\! sleep 1;
\i core/address/xm/functions/address_use_count.sql;
\! sleep 1;
-- core/address tables
\i core/address/private/tables/datatype.sql;
\! sleep 1;
-- core/address xm models
\i core/address/xm/models/address.sql;
\! sleep 1;
\i core/address/xm/models/address_characteristic.sql;
\! sleep 1;
\i core/address/xm/models/address_comment.sql;
\! sleep 1;
\i core/address/xm/models/country.sql;
\! sleep 1;
\i core/address/xm/models/state.sql;
\! sleep 2;
-- core/comment xm views
\i core/comment/xm/views/comments.sql;
\! sleep 1;
\i core/comment/xm/views/comment_type.sql;
\! sleep 2;
\i core/contact/private/tables/datatype.sql;
\! sleep 1;
-- core/contact xm models
\i core/contact/xm/models/contact.sql;
\! sleep 1;
\i core/contact/xm/models/contact_info.sql;
\! sleep 1;
\i core/contact/xm/models/contact_characteristic.sql;
\! sleep 1;
\i core/contact/xm/models/contact_comment.sql;
\! sleep 1;
\i core/contact/xm/models/contact_document.sql;
\! sleep 1;
\i core/contact/xm/models/contact_email.sql;
\! sleep 1;
\i core/contact/xm/models/honorific.sql;
\! sleep 2;
-- core/currency xm views
\i core/currency/xm/views/currency.sql;
\! sleep 1;
\i core/currency/xm/views/currency_rate.sql;
\! sleep 2;
\i core/item/private/tables/datatype.sql;
\! sleep 1;
-- core/item xm views
\i core/item/xm/views/item.sql;
\! sleep 1;
\i core/item/xm/views/item_alias.sql; 
\! sleep 1;
\i core/item/xm/views/item_characteristic.sql;
\! sleep 1;
\i core/item/xm/views/item_comment.sql;
\! sleep 1;
\i core/item/xm/views/item_conversion.sql;
\! sleep 1;
\i core/item/xm/views/item_conversion_type_assignment.sql;
\! sleep 1;
\i core/item/xm/views/item_document.sql;
\! sleep 1;
\i core/item/xm/views/item_info.sql;
\! sleep 1;
\i core/item/xm/views/item_substitute.sql;
\! sleep 2;
-- core/priority xm views 
\i core/priority/xm/views/priority.sql;
\! sleep 2;
-- core/site xm views 
\i core/site/xm/views/site.sql;
\! sleep 1;
\i core/site/xm/views/site_comment.sql;
\! sleep 1;
\i core/site/xm/views/site_type.sql;
\! sleep 1;
\i core/site/xm/views/site_zone.sql;
\! sleep 1;
\i core/site/xm/views/site_info.sql;
\! sleep 2;
-- core/unit xm views
\i core/unit/xm/views/unit.sql;
\! sleep 1;
\i core/unit/xm/views/unit_conversion.sql;
\! sleep 2;
-- core/user/private/functions [ get_user_id.sql ] does nothing needs to be removed
-- core/user triggers
\i core/user/private/trigger_functions/user_duplicate_check.sql;
\! sleep 1;
-- core/user tables
\i core/user/private/tables/datatype.sql;
\! sleep 1;
\i core/user/private/tables/user.sql;
\! sleep 1;
-- core/user xm models
\i core/user/xm/models/user_account.sql;
\! sleep 1;
\i core/user/xm/models/user_account_info.sql;
\! sleep 1;
\i core/user/xm/models/privilege.sql;
\! sleep 1;
\i core/user/xm/models/language.sql;
\! sleep 1;
\i core/user/xm/models/locale.sql;
\! sleep 2;
-- [ END ] core

-- [ START ] business
-- business/account functions
-- business/account triggers
-- business/account tables
\i business/account/private/tables/datatype.sql;
\! sleep 1;
-- business/account public tables
\i business/account/public/tables/crmacct.sql;
\! sleep 1;
-- business/account xm views
\i business/account/xm/views/account.sql;
\! sleep 1;
\i business/account/xm/views/account_info.sql;
\! sleep 1;
\i business/account/xm/views/account_characteristic.sql;
\! sleep 1;
\i business/account/xm/views/account_comment.sql;
\! sleep 1;
\i business/account/xm/views/account_document.sql;
\! sleep 2;
-- business/account/incident tables
\i business/account/incident/private/tables/datatype.sql;
\! sleep 1;
-- business/account/incident functions
-- business/account/incident triggers
-- business/account/incident xm view
\i business/account/incident/xm/views/incident.sql;
\! sleep 1;
\i business/account/incident/xm/views/incident_alarm.sql;
\! sleep 1;
\i business/account/incident/xm/views/incident_category.sql;
\! sleep 1;
\i business/account/incident/xm/views/incident_characteristic.sql;
\! sleep 1;
\i business/account/incident/xm/views/incident_comment.sql;
\! sleep 1;
\i business/account/incident/xm/views/incident_history.sql;
\! sleep 1;
\i business/account/incident/xm/views/incident_info.sql;
\! sleep 1;
\i business/account/incident/xm/views/incident_resolution.sql;
\! sleep 1;
\i business/account/incident/xm/views/incident_severity.sql;
\! sleep 2;
-- business/account/opportunity tables
\i business/account/opportunity/private/tables/datatype.sql;
\! sleep 1;
-- business/account/opportunity xm view
\i business/account/opportunity/xm/views/opportunity.sql;
\! sleep 1
\i business/account/opportunity/xm/views/opportunity_characteristic.sql;
\! sleep 1;
\i business/account/opportunity/xm/views/opportunity_comment.sql;
\! sleep 1;
\i business/account/opportunity/xm/views/opportunity_info.sql;
\! sleep 1;
\i business/account/opportunity/xm/views/opportunity_source.sql;
\! sleep 1;
\i business/account/opportunity/xm/views/opportunity_stage.sql;
\! sleep 1;
\i business/account/opportunity/xm/views/opportunity_type.sql;
\! sleep 2;
-- business/customer tables
\i business/customer/private/tables/datatype.sql;
\! sleep 1;
-- business/employee tables
\i business/employee/private/tables/datatype.sql;
\! sleep 1;
-- business/project xm view
\i business/project/xm/views/project.sql;
\! sleep 1;
\i business/project/xm/views/project_comment.sql;
\! sleep 1;
\i business/project/xm/views/project_document.sql;
\! sleep 1;
\i business/project/xm/views/project_info.sql;
\! sleep 1;
\i business/project/xm/views/project_task.sql;
\! sleep 1;
\i business/project/xm/views/project_task_alarm.sql;
\! sleep 1;
\i business/project/xm/views/project_task_comment.sql;
\! sleep 2;
-- business/todo xm view
\i business/todo/xm/views/todo.sql;
\! sleep 1;
\i business/todo/xm/views/todo_alarm.sql;
\! sleep 1;
\i business/todo/xm/views/todo_comment.sql;
\! sleep 1;
\i business/todo/xm/views/todo_info.sql;
\! sleep 2;
-- [ END ] business
