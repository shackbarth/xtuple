drop type if exists xm.ext_price cascade;

create type xm.ext_price as (
  amount numeric(12,2),
  currency integer,
  effective date,
  rate numeric,
  is_posted boolean
)