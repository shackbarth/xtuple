-- table definition

select xt.create_table('oa2clientredirs');
select xt.add_column('oa2clientredirs','oa2clientredirs_id', 'serial', 'primary key', 'xt', 'oa2clientredirs table primary key.');
select xt.add_column('oa2clientredirs','oa2clientredirs_oa2client_id', 'integer', 'references xt.oa2client (oa2client_id)', 'xt', 'oa2client_id this redirect URI maps to.');
select xt.add_column('oa2clientredirs','oa2clientredirs_redirect_uri', 'text', '', 'xt', 'The redirect URI');
select xt.add_constraint('oa2clientredirs','oa2clientredirs_oa2client_id_redirect_uri', 'unique (oa2clientredirs_oa2client_id, oa2clientredirs_redirect_uri)');

comment on table xt.oa2clientredirs is 'Maps redirect URIs to OAuth 2.0 clients.';
