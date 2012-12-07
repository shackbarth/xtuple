-- add necessary privs

select xt.add_priv('AccessCRMExtension', 'Can Access CRM Extension', 'AccessCRMExtension', 'CRM', 'crm', 'CRM', true);
