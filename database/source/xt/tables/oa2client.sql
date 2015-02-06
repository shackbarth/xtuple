-- table definition

select xt.create_table('oa2client');
select xt.add_column('oa2client','oa2client_id', 'serial', 'primary key', 'xt', 'oa2client table primary key.');
select xt.add_column('oa2client','oa2client_client_id', 'text', 'not null unique', 'xt', 'Generated client_id obtained during application registration.');
select xt.add_column('oa2client','oa2client_client_secret', 'text', 'unique', 'xt', 'The client secret obtained during application registration.');
select xt.add_column('oa2client','oa2client_client_name', 'text', '', 'xt', 'Name of the client or application.');
select xt.add_column('oa2client','oa2client_client_email', 'text', '', 'xt', 'Email address of the client.');
select xt.add_column('oa2client','oa2client_client_web_site', 'text', '', 'xt', 'Web site of the client.');
select xt.add_column('oa2client','oa2client_client_logo', 'text', '', 'xt', 'URL to client logo image file displayed during auth grant.');
select xt.add_column('oa2client','oa2client_client_type', 'text', '', 'xt', 'The OAuth 2.0 client type: "web_server", "installed_app", "service_account"');
select xt.add_column('oa2client','oa2client_active', 'boolean', '', 'xt', 'Flag to make a client active or not.');
select xt.add_column('oa2client','oa2client_issued', 'timestamp', '', 'xt', 'The datetime that the client was registered');
select xt.add_column('oa2client','oa2client_auth_uri', 'text', '', 'xt', 'The Authorization Endpoint URI.');
select xt.add_column('oa2client','oa2client_token_uri', 'text', '', 'xt', 'The Token Endpoint URI.');
select xt.add_column('oa2client','oa2client_delegated_access', 'boolean', '', 'xt', 'Flag to allow "service_account" client to use delegated access as another user.');
select xt.add_column('oa2client','oa2client_client_x509_pub_cert', 'text', '', 'xt', 'The public x509 certificate, used to verify JWTs signed by the client.');
select xt.add_column('oa2client','oa2client_org', 'text', 'not null default current_database()', 'xt', 'The name of the current database.');

comment on table xt.oa2client is 'Defines global OAuth 2.0 server registered client storage.';

----------------------------------------------------------
-- Upsert row defining Client using oauth single signon
----------------------------------------------------------
DELETE FROM xt.oa2client WHERE oa2client_client_id = 'oauthsso';

INSERT INTO xt.oa2client
(oa2client_client_id,
oa2client_client_secret,
oa2client_client_name,
oa2client_client_email,
oa2client_client_web_site,
oa2client_client_logo,
oa2client_client_type,
oa2client_active,
oa2client_issued,
oa2client_auth_uri,
oa2client_token_uri,
oa2client_delegated_access,
oa2client_client_x509_pub_cert)
SELECT
'oauthsso',
'oauthsso',
'xTuple',
'info@xtuple.com',
'www.xtuple.com',
NULL,
'assertion',
true,
'2013-06-20 01:00:00.000000',
'dialog/authorize',
'oauth/token',
true,
'-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChqPrMA4/kRvvZr2iyNfvZl/yG
QsPjuDHFtFNxydfMk1ZHDofLUd83mJeu4I18RBTAwrQHk8askA3DhlL6jOkGs81V
ia8RqkAgoDslgQrcckD4mduxRUDQ/n2LGK50VsgfXA4VsPD7eU2G32W9GrhV6R/i
Y+HkgBjVqN7Nxy/2sQIDAQAB
-----END PUBLIC KEY-----
'
WHERE NOT EXISTS (SELECT 1 from xt.oa2client WHERE oa2client_client_id = 'oauthsso');
