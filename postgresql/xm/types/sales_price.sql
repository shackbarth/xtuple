drop type if exists xm.sales_price cascade;

create type xm.sales_price as (
  amount numeric(16,4),
  currency integer,
  effective date,
  rate numeric,
  is_posted boolean
)