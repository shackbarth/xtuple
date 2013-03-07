-- table definition

select xt.create_table('oauth2client');
select xt.add_column('oauth2client','oauth2client_id', 'serial', 'primary key', 'xt', 'oauth2client table primary key.');
select xt.add_column('oauth2client','oauth2client_client_id', 'text', 'not null unique', 'xt', 'Generated client_id obtained during application registration.');
select xt.add_column('oauth2client','oauth2client_client_secret', 'text', 'unique', 'xt', 'The client secret obtained during application registration.');
select xt.add_column('oauth2client','oauth2client_client_name', 'text', '', 'xt', 'Name of the client or application.');
select xt.add_column('oauth2client','oauth2client_client_email', 'text', '', 'xt', 'Email address of the client.');
select xt.add_column('oauth2client','oauth2client_client_web_site', 'text', '', 'xt', 'Web site of the client.');
select xt.add_column('oauth2client','oauth2client_client_logo', 'text', '', 'xt', 'URL to client logo image file displayed during auth grant.');
select xt.add_column('oauth2client','oauth2client_client_type', 'text', '', 'xt', 'The OAuth 2.0 client type: "web_server", "installed_app", "service_account"');
select xt.add_column('oauth2client','oauth2client_active', 'boolean', '', 'xt', 'Flag to make a client active or not.');
select xt.add_column('oauth2client','oauth2client_issued', 'timestamp', '', 'xt', 'The datetime that the client was registered');
select xt.add_column('oauth2client','oauth2client_auth_uri', 'text', '', 'xt', 'The Authorization Endpoint URI.');
select xt.add_column('oauth2client','oauth2client_token_uri', 'text', '', 'xt', 'The Token Endpoint URI.');
select xt.add_column('oauth2client','oauth2client_redirect_uris', 'text[]', 'not null', 'xt', 'A list of valid Redirection Endpoint URIs.');
select xt.add_column('oauth2client','oauth2client_delegated_access', 'boolean', '', 'xt', 'Flag to allow "service_account" client to use delegated access as another user.');
select xt.add_column('oauth2client','oauth2client_client_x509_cert_url', '', 'text', 'xt', 'The URL of the public x509 certificate, used to verify JWTs signed by the client.');
select xt.add_column('oauth2client','oauth2client_auth_provider_x509_cert_url', 'text', '', 'xt', 'The URL of the public x509 certificate, used to verify the signature on JWTs, such as ID tokens, signed by the authentication provider.');

comment on table xt.oauth2client is 'Defines global OAuth 2.0 server registered client storage.';
