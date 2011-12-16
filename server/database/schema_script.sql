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
\i core/global/private/functions/create_table.sql;
\! sleep 1;
\i core/global/private/functions/add_column.sql;
\! sleep 1;
\i core/global/private/functions/add_constraint.sql;
\! sleep 1;
\i core/global/private/functions/execute_query.sql;
\! sleep 1;
\i core/global/private/functions/get_id.sql;
\! sleep 2;
-- core/type tables
\i core/type/private/tables/datatype.sql;
\! sleep 1;
-- core/type xm views
\i core/type/xm/views/type.sql;
\! sleep 2;
-- core/characteristic functions
\i core/characteristic/private/functions/get_charrole_type_name.sql;
\! sleep 1;
-- core/characteristic triggers
\i core/characteristic/private/trigger_functions/core_sync_char_to_charroleass.sql;
\! sleep 1;
-- core/characteristic tables
\i core/characteristic/private/tables/charrole.sql;
\! sleep 1;
\i core/characteristic/private/tables/charroleass.sql;
\! sleep 1;
-- core/characteristic public tables
\i core/characteristic/public/tables/char.sql;
\! sleep 1;
-- core/characteristic xm views
\i core/characteristic/xm/views/characteristic.sql;
\! sleep 1;
\i core/characteristic/xm/views/characteristic_option.sql;
\! sleep 1;
\i core/characteristic/xm/views/characteristic_role.sql;
\! sleep 1;
\i core/characteristic/xm/views/characteristic_role_assignment.sql;
\! sleep 2;
-- core/document
\i core/document/private/datatype.sql;
\! sleep 1;
-- core/document xm views
\i core/document/xm/views/file.sql;
\! sleep 1;
\i core/document/xm/views/image.sql;
\! sleep 1;
\i core/document/xm/views/url.sql;
\! sleep 2;
-- core/address triggers
\i core/address/private/trigger_functions/address_sync_char_to_charroleass.sql;
\! sleep 1;
\i core/address/private/trigger_functions/address_sync_charroleass_to_char.sql;
\! sleep 1;
-- core/address xm functions
\i core/address/xm/functions/address_find_existing.sql;
\! sleep 1;
\i core/address/xm/functions/address_use_count.sql;
\! sleep 1;
-- core/address tables
\i core/address/private/tables/charrole.sql;
\! sleep 1;
\i core/address/private/tables/charroleass.sql;
\! sleep 1;
\i core/address/private/tables/datatype.sql;
\! sleep 1;
-- core/address public tables
\i core/address/public/tables/char.sql;
\! sleep 1;
-- core/address xm views
\i core/address/xm/views/address.sql;
\! sleep 1;
\i core/address/xm/views/address_characteristic.sql;
\! sleep 1;
\i core/address/xm/views/address_comment.sql;
\! sleep 1;
\i core/address/xm/views/country.sql;
\! sleep 1;
\i core/address/xm/views/state.sql;
\! sleep 2;
-- core/comment xm views
\i core/comment/xm/views/comment_type.sql;
\! sleep 2;
-- core/contact triggers
\i core/contact/private/trigger_functions/contact_sync_char_to_charroleass.sql;
\! sleep 1;
\i core/contact/private/trigger_functions/contact_sync_charroleass_to_char.sql;
\! sleep 1;
-- core/contact tables
\i core/contact/private/tables/charrole.sql;
\! sleep 1;
\i core/contact/private/tables/charroleass.sql;
\! sleep 1;
\i core/contact/private/tables/datatype.sql;
\! sleep 1;
-- core/contact public tables
\i core/contact/public/tables/char.sql;
\! sleep 1;
-- core/contact xm views
\i core/contact/xm/views/contact.sql;
\! sleep 1;
\i core/contact/xm/views/contact_info.sql;
\! sleep 1;
\i core/contact/xm/views/contact_characteristic.sql;
\! sleep 1;
\i core/contact/xm/views/contact_comment.sql;
\! sleep 1;
\i core/contact/xm/views/contact_document.sql;
\! sleep 1;
\i core/contact/xm/views/contact_email.sql;
\! sleep 1;
\i core/contact/xm/views/honorific.sql;
\! sleep 2;
-- core/currency xm views
\i core/currency/xm/views/currency.sql;
\! sleep 1;
\i core/currency/xm/views/currency_rate.sql;
\! sleep 2;
-- core/item triggers
\i core/item/private/trigger_functions/item_sync_char_to_charroleass.sql;
\! sleep 1;
\i core/item/private/trigger_functions/item_sync_charroleass_to_char.sql;
\! sleep 1;
-- core/item tables
\i core/item/private/tables/charrole.sql;
\! sleep 1;
\i core/item/private/tables/charroleass.sql;
\! sleep 1;
\i core/item/private/tables/datatype.sql;
\! sleep 1;
-- core/item public tables
\i core/item/public/tables/char.sql;
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
-- core/user xm views
\i core/user/xm/views/user.sql;
\! sleep 1;
\i core/user/xm/views/user_info.sql;
\! sleep 1;
\i core/user/xm/views/user_privilege_assignment.sql; 
\! sleep 1;
\i core/user/xm/views/privilege.sql;
\! sleep 1;
\i core/user/xm/views/language.sql;
\! sleep 1;
\i core/user/xm/views/locale.sql;
\! sleep 1;
\i core/user/xm/views/user_role.sql;
\! sleep 1;
\i core/user/xm/views/user_role_privilege_assignment.sql;
\! sleep 1;
\i core/user/xm/views/user_user_role_assignment.sql;
\! sleep 2;
-- [ END ] core

-- [ START ] business
-- business/account functions
\i business/account/private/functions/get_crmacctrole_type_name.sql;
\! sleep 1;
-- business/account triggers
\i business/account/private/trigger_functions/user_sync_crmacctroleass_to_crmacct.sql;
\! sleep 1;
\i business/account/private/trigger_functions/core_sync_crmacct_to_crmacctroleass.sql;
\! sleep 1;
\i business/account/private/trigger_functions/user_sync_crmacct_to_crmacctroleass.sql;
\! sleep 1;
\i business/account/private/trigger_functions/account_sync_char_to_charroleass.sql;
\! sleep 1;
\i business/account/private/trigger_functions/account_sync_charroleass_to_char.sql;
\! sleep 1;
-- business/account tables
\i business/account/private/tables/crmacctroleass.sql;
\! sleep 1;
\i business/account/private/tables/crmacctrole.sql;
\! sleep 1;
\i business/account/private/tables/charrole.sql;
\! sleep 1;
\i business/account/private/tables/charroleass.sql;
\! sleep 1;
\i business/account/private/tables/datatype.sql;
\! sleep 1;
-- business/account public tables
\i business/account/public/tables/crmacct.sql;
\! sleep 1;
\i business/account/public/tables/char.sql;
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
\! sleep 1;
\i business/account/xm/views/account_role.sql;
\! sleep 1;
\i business/account/xm/views/account_role_assignment.sql;
\! sleep 2;
-- business/account/incident triggers
\i business/account/incident/private/trigger_functions/incident_sync_char_to_charroleass.sql;
\! sleep 1;
\i business/account/incident/private/trigger_functions/incident_sync_charroleass_to_char.sql;
\! sleep 1;
-- business/account/incident tables
\i business/account/incident/private/tables/charrole.sql;
\! sleep 1;
\i business/account/incident/private/tables/charroleass.sql;
\! sleep 1;
\i business/account/incident/private/tables/datatype.sql;
\! sleep 1;
-- business/account/incident public tables
\i business/account/incident/public/tables/char.sql;
\! sleep 1;
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
-- business/account/opportunity triggers
\i business/account/opportunity/private/trigger_functions/opportunity_sync_char_to_charroleass.sql;
\! sleep 1;
\i business/account/opportunity/private/trigger_functions/opportunity_sync_charroleass_to_char.sql;
\! sleep 1;
-- business/account/opportunity tables
\i business/account/opportunity/private/tables/charrole.sql;
\! sleep 1;
\i business/account/opportunity/private/tables/charroleass.sql;
\! sleep 1;
\i business/account/opportunity/private/tables/datatype.sql;
\! sleep 1;
-- business/account/opportunity public tables
\i business/account/opportunity/public/tables/char.sql;
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
-- business/customer triggers
\i business/customer/private/trigger_functions/customer_sync_char_to_charroleass.sql;
\! sleep 1;
\i business/customer/private/trigger_functions/customer_sync_charroleass_to_char.sql;
\! sleep 1;
-- business/customer tables
\i business/customer/private/tables/charrole.sql;
\! sleep 1;
\i business/customer/private/tables/charroleass.sql;
\! sleep 1;
\i business/customer/private/tables/datatype.sql;
\! sleep 1;
-- business/customer public tables
\i business/customer/public/tables/char.sql;
\! sleep 2;
-- business/employee triggers
\i business/employee/private/trigger_functions/employee_sync_char_to_charroleass.sql;
\! sleep 1;
\i business/employee/private/trigger_functions/employee_sync_charroleass_to_char.sql;
\! sleep 1;
-- business/employee tables
\i business/employee/private/tables/charrole.sql;
\! sleep 1;
\i business/employee/private/tables/charroleass.sql;
\! sleep 1;
\i business/employee/private/tables/datatype.sql;
\! sleep 1;
-- business/employee public tables
\i business/employee/public/tables/char.sql;
\! sleep 2;
-- business/project xm view
\i business/project/xm/views/project.sql;
\! sleep 1;
\i business/project/xm/views/project_comment.sql;
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
