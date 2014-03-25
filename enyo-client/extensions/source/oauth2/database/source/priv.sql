select xt.add_priv('MaintainOauth2clients', 'Can Maintain OAUTH2 Clients', 'oauth2', 'OAUTH2');

-- Grant the ADMIN ROle this Extension.
select xt.grant_role_ext('ADMIN', 'oauth2');
