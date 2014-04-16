SELECT dropIfExists('VIEW',     'purchaseorder', 'api');
SELECT dropIfExists('FUNCTION', 'calculatetaxdetailsummary(text,integer,text)');
SELECT dropIfExists('FUNCTION', 'calculatetaxdetailline(text,integer)');
SELECT dropIfExists('FUNCTION', 'calculatetaxdetail(integer,integer,date,integer,numeric)');
SELECT dropIfExists('FUNCTION', 'calculatesubtax(integer,date,integer,numeric,integer)');
SELECT dropIfExists('TYPE', 'taxdetail');

CREATE TYPE taxdetail AS
(
  taxdetail_tax_id integer,
  taxdetail_tax_code text,
  taxdetail_tax_descrip text,
  taxdetail_tax_basis_tax_id integer,
  taxdetail_taxrate_percent numeric(10,6),
  taxdetail_taxrate_amount numeric(16,2),
  taxdetail_level integer,
  taxdetail_taxclass_id integer,
  taxdetail_taxclass_code text,
  taxdetail_taxclass_sequence integer,
  taxdetail_tax numeric (16,6),
  taxdetail_curr_id integer,
  taxdetail_curr_abbr text
);
