-- table definition

select xt.create_table('form');
select xt.add_column('form','form_id', 'serial', 'primary key');
select xt.add_column('form','form_name', 'text', 'not null');
select xt.add_column('form','form_description', 'text');
select xt.add_column('form','form_model_name', 'text');
select xt.add_column('form','form_key', 'text');
select xt.add_column('form','form_rptdef_id', 'integer');
select xt.add_column('form','form_printer_id', 'integer');

comment on table xt.form is 'Form setup table';

select xt.add_priv('MaintainForms', 'Can Maintain Forms', 'Form', 'Form');
