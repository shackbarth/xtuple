-- table definition
-- TODO - review the requirements and update this table definition appropriately.
select xt.create_table('printer');
select xt.add_column('printer','printer_id', 'serial', 'primary key');
select xt.add_column('printer','printer_name', 'text', 'not null');
select xt.add_column('printer','printer_description', 'text');
select xt.add_column('printer','printer_default', 'boolean');
select xt.add_column('printer','printer_charset', 'text');
select xt.add_column('printer','printer_language', 'text');
select xt.add_column('printer','printer_uri', 'text');
select xt.add_column('printer','printer_version', 'numeric');

comment on table xt.printer is 'Core printer setup table for use with npm ipp printing';

-- add foreign key constraint to xt.form table's form_printer_id column.
select xt.add_constraint('form', 'form_printer_id_fkey', 'foreign key (form_printer_id) references xt.printer (printer_id)');
-- create new privilege
select xt.add_priv('MaintainPrinters', 'Can Maintain Printers', 'Printer', 'Printer');