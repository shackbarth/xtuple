create or replace view xt.invcheadtaxadj as
  select 
    taxhist_id, 
    taxhist_parent_id, 
    taxhist_tax_id, 
    taxhist_docdate, 
    taxhist_tax,
    taxhist_sequence
  from invcheadtax
  where taxhist_taxtype_id=getadjustmenttaxtypeid();

grant all on table xt.invcheadtaxadj to xtrole;
comment on view xt.invcheadtaxadj is 'invoice header tax adjustments';

-- rules

create or replace rule "_INSERT" as
  on insert to xt.invcheadtaxadj do instead

insert into invcheadtax (
  taxhist_id,
  taxhist_basis,
  taxhist_percent,
  taxhist_amount,
  taxhist_docdate, 
  taxhist_tax_id, 
  taxhist_sequence,
  taxhist_tax, 
  taxhist_taxtype_id, 
  taxhist_parent_id
) values (
  new.taxhist_id,
  0, 
  0, 
  0, 
  new.taxhist_docdate,
  new.taxhist_tax_id, 
  0, 
  new.taxhist_tax, 
  getadjustmenttaxtypeid(), 
  new.taxhist_parent_id
);

create or replace rule "_UPDATE" as
  on update to xt.invcheadtaxadj do instead

  update taxhist set
    taxhist_tax=new.taxhist_tax,
    taxhist_docdate=new.taxhist_docdate
  where taxhist_id=old.taxhist_id;

create or replace rule "_DELETE" as
  on delete to xt.invcheadtaxadj do instead

  delete from taxhist
  where taxhist_id=old.taxhist_id;

