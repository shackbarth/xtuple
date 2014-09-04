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
