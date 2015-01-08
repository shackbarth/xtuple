-- table definition
-- TODO - review the requirements and update this table definition appropriately.
select xt.create_table('printer');
select xt.add_column('printer','printer_id', 'serial', 'primary key');
select xt.add_column('printer','printer_name', 'text', 'not null');
select xt.add_column('printer','printer_description', 'text');

comment on table xt.printer is 'Core printer setup table for use with CUPS printing';

-- create new privilege
select xt.add_priv('MaintainPrinters', 'Can Maintain Printers', 'System', 'System');

-- Provide a system default 'Browser' printer
insert into xt.printer (printer_name, printer_description) 
select 'Browser', 'Pdf in new tab in browser'
where not exists (select * from xt.printer where printer_name = 'Browser');