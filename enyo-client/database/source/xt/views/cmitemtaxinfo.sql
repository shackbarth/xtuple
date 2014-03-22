select xt.create_view('xt.cmitemtaxinfo', $$
  -- this view exists for two reasons:
  -- 1. to silently quash any writes to this business object.
  -- the data is all taken care of with triggers
  -- 2. To multiply the tax amount by -1 so the client doesn't
  -- have to.

select
taxhist_id,
taxhist_parent_id,
taxhist_taxtype_id,
taxhist_tax_id,
taxhist_basis,
taxhist_basis_tax_id,
taxhist_sequence,
taxhist_percent,
taxhist_amount,
taxhist_tax * -1 as taxhist_tax,
taxhist_docdate,
taxhist_distdate,
taxhist_curr_id,
taxhist_curr_rate,
taxhist_journalnumber,
obj_uuid
from cmitemtax;

$$, true);
