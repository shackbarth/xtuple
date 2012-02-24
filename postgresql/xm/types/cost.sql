drop type if exists xm.cost cascade;

create type xm.cost as (
  amount numeric(16,6),
  currency integer,
  effective date,
  rate numeric,
  is_posted boolean
)