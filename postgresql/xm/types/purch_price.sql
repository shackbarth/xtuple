drop type if exists xm.purch_price cascade;

create type xm.purch_price as (
  amount numeric(16,6),
  currency integer,
  effective date,
  rate numeric,
  is_posted boolean
)