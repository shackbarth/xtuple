-- table definition

select xt.create_table('oa2token');
select xt.add_column('oa2token','oa2token_id', 'serial', 'primary key', 'xt', 'oa2token table primary key.');
select xt.add_column('oa2token','oa2token_username', 'text', '', 'xt', 'Indicates the username this token exchange is for.');
select xt.add_column('oa2token','oa2token_client_id', 'text', 'not null references xt.oa2client (oa2client_client_id) on delete cascade', 'xt', 'Indicates the client that is making the request.');
select xt.add_column('oa2token','oa2token_redirect_uri', 'text', '', 'xt', 'Determines where the response is sent.');
select xt.add_column('oa2token','oa2token_scope', 'text', 'not null', 'xt', 'Indicates the xTuple org access your application is requesting.');
select xt.add_column('oa2token','oa2token_state', 'text', '', 'xt', 'Indicates any state which may be useful to your application upon receipt of the response.');
select xt.add_column('oa2token','oa2token_approval_prompt', 'boolean', '', 'xt', 'Indicates if the user should be re-prompted for consent.');
select xt.add_column('oa2token','oa2token_auth_code', 'text', 'unique', 'xt', 'The auth code returned from the initial authorization request.');
select xt.add_column('oa2token','oa2token_auth_code_issued', 'timestamp', '', 'xt', 'The datetime the auth code was issued.');
select xt.add_column('oa2token','oa2token_auth_code_expires', 'timestamp', '', 'xt', 'The datetime that the auth code expires.');
select xt.add_column('oa2token','oa2token_refresh_token', 'text', 'unique', 'xt', 'The refresh token used to get a new access token when an old one expires.');
select xt.add_column('oa2token','oa2token_refresh_issued', 'timestamp', '', 'xt', 'The datetime the refresh token was issued.');
select xt.add_column('oa2token','oa2token_refresh_expires', 'timestamp', '', 'xt', 'The datetime that the refresh token expires.');
select xt.add_column('oa2token','oa2token_access_token', 'text', 'unique', 'xt', 'The current access token to be included with every API call.');
select xt.add_column('oa2token','oa2token_access_issued', 'timestamp', '', 'xt', 'The datetime the access token was issued.');
select xt.add_column('oa2token','oa2token_access_expires', 'timestamp', '', 'xt', 'The datetime that the access token expires.');
select xt.add_column('oa2token','oa2token_token_type', 'text', 'not null', 'xt', 'Indicates the type of token returned. At this time, this field will always have the value Bearer.');
select xt.add_column('oa2token','oa2token_access_type', 'text', '', 'xt', 'Indicates if a web_server needs to access an API when the user is not present.');
select xt.add_column('oa2token','oa2token_delegate', 'text', '', 'xt', 'username for which a service_account is requesting delegated access as.');

comment on table xt.oa2token is 'Defines global OAuth 2.0 server token storage.';
