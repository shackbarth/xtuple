-- table definition

select xt.create_table('printer');
select xt.add_column('printer','printer_id', 'serial', 'primary key');
select xt.add_column('printer','printer_code', 'text', 'not null');
select xt.add_column('printer','printer_description', 'text');
select xt.add_column('printer','printer_default', 'boolean');
select xt.add_column('printer','printer_charset', 'text');
select xt.add_column('printer','printer_language', 'text');
select xt.add_column('printer','printer_uri', 'text');
select xt.add_column('printer','printer_version', 'numeric');

comment on table xt.printer is 'Core printer setup table for use with npm ipp printing';

-- table definition

select xt.create_table('form');
select xt.add_column('form','form_id', 'serial', 'primary key');
select xt.add_column('form','form_name', 'text', 'not null');
select xt.add_column('form','form_description', 'text');
select xt.add_column('form','form_key', 'boolean');
select xt.add_column('form','form_rptdef_id', 'integer');

comment on table xt.form is 'Form setup table';

select xt.add_constraint('form', 'form_rptdef_id_fkey', 'foreign key (form_rptdef_id) references xt.rptdef (rptdef_id)');
