select private.create_model(

-- Model name, schema, table

'locale', 'public', 'locale',

-- Columns

E'{
  "locale_id as id",
  "locale_code as code",
  "locale_descrip as description",
  "locale_comments as notes",
  "locale_lang_id as language",
  "locale_country_id as country",
  "locale_error_color as error_color",
  "locale_warning_color as warning_color",
  "locale_emphasis_color as emphasis_color",
  "locale_altemphasis_color as alt_emphasis_color",
  "locale_expired_color as expired_color",
  "locale_future_color as future_color",
  "locale_curr_scale as currency_scale",
  "locale_salesprice_scale as sales_price_scale",
  "locale_purchprice_scale as purchase_price_scale",
  "locale_extprice_scale as extended_price_scale",
  "locale_cost_scale as cost_scale",
  "locale_qty_scale as quantity_scale",
  "locale_qtyper_scale as quantity_per_scale",
  "locale_uomratio_scale as unit_ratio_scale",
  "locale_percent_scale as percent_scale"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.locale
  do instead

insert into public.locale (
  locale_id,
  locale_code,
  locale_descrip,
  locale_comments,
  locale_lang_id,
  locale_country_id,
  locale_error_color,
  locale_warning_color,
  locale_emphasis_color,
  locale_altemphasis_color,
  locale_expired_color,
  locale_future_color,
  locale_curr_scale,
  locale_salesprice_scale,
  locale_purchprice_scale,
  locale_extprice_scale,
  locale_cost_scale,
  locale_qty_scale,
  locale_qtyper_scale,
  locale_uomratio_scale,
  locale_percent_scale )
values (
  new.id,
  new.code,
  new.description,
  new.notes,
  new.language,
  new.country,
  new.error_color,
  new.warning_color,
  new.emphasis_color,
  new.alt_emphasis_color,
  new.expired_color,
  new.future_color,
  new.currency_scale,
  new.sales_price_scale,
  new.purchase_price_scale,
  new.extended_price_scale,
  new.cost_scale,
  new.quantity_scale,
  new.quantity_per_scale,
  new.unit_ratio_scale,
  new.percent_scale );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.locale
  do instead

update public.locale set
  locale_code = new.code,
  locale_descrip = new.description,
  locale_comments = new.notes,
  locale_lang_id = new.language,
  locale_country_id = new.country,
  locale_error_color = new.error_color,
  locale_warning_color = new.warning_color,
  locale_emphasis_color = new.emphasis_color,
  locale_altemphasis_color = new.alt_emphasis_color,
  locale_expired_color = new.expired_color,
  locale_future_color = new.future_color,
  locale_curr_scale = new.currency_scale,
  locale_salesprice_scale = new.sales_price_scale,
  locale_purchprice_scale = new.purchase_price_scale,
  locale_extprice_scale = new.extended_price_scale,
  locale_cost_scale = new.cost_scale,
  locale_qty_scale = new.quantity_scale,
  locale_qtyper_scale = new.quantity_per_scale,
  locale_uomratio_scale = new.unit_ratio_scale,
  locale_percent_scale = new.percent_scale
where ( locale_id = old.id );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.locale
  do instead 
  
delete from public.locale
where ( locale_id = old.id );

"}', 

-- Conditions, Comment, System

'{}', 'Locale Model', true);
