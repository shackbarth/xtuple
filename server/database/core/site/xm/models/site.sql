select private.create_model(

-- Model name, schema, table

'site', 'public', 'whsinfo',

-- Columns

E'{
  "whsinfo.warehous_id as guid",
  "whsinfo.warehous_code as code",
  "whsinfo.warehous_descrip as description",
  "whsinfo.warehous_addr_id as address",
  "whsinfo.warehous_taxzone_id as zones",
  "whsinfo.warehous_cntct_id as contact",
  "whsinfo.warehous_shipcomments as shipping_notes",
  "whsinfo.warehous_aislesize as aisle_size",
  "whsinfo.warehous_binsize as bin_size",
  "whsinfo.warehous_counttag_number as count_tag_number",
  "whsinfo.warehous_counttag_prefix as count_tag_prefix",
  "whsinfo.warehous_fob as default_fob",
  "whsinfo.warehous_aislealpha as is_aisle_alpha",
  "whsinfo.warehous_binalpha as is_bin_alpha",
  "whsinfo.warehous_useslips as is_enforce_count_slips",
  "whsinfo.warehous_enforcearbl as is_enforce_naming",
  "whsinfo.warehous_usezones as is_enforce_zones",
  "whsinfo.warehous_locationalpha as is_location_alpha",
  "whsinfo.warehous_rackalpha as is_rack_alpha",
  "whsinfo.warehous_shipping as is_shipping",
  "whsinfo.warehous_locationsize as location_size",
  "whsinfo.warehous_racksize as rack_size",
  "whsinfo.warehous_sitetype_id as site_type",
  "btrim(array(
    select comment_id
    from \\"comment\\"
    where comment_source_id = whsinfo.warehous_id
      and comment_source = \'WH\')::text,\'{}\') as \\"comments\\"",  
  "whsinfo.warehous_active as is_active"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.site
  do instead
   
insert into whsinfo (
  warehous_id,
  warehous_code,
  warehous_descrip,
  warehous_addr_id,
  warehous_taxzone_id,
  warehous_cntct_id,
  warehous_shipcomments,
  warehous_aislesize,
  warehous_binsize,
  warehous_counttag_number,
  warehous_counttag_prefix, 
  warehous_fob, 
  warehous_aislealpha, 
  warehous_binalpha,
  warehous_useslips,
  warehous_enforcearbl, 
  warehous_usezones,
  warehous_locationalpha, 
  warehous_rackalpha,
  warehous_shipping,
  warehous_locationsize,
  warehous_racksize,
  warehous_sitetype_id,
  warehous_active )
values (
  new.guid,
  new.code,
  new.description,
  new.address,
  new.zones,
  new.contact,
  new.shipping_notes,
  new.aisle_size,
  new.bin_size,
  new.count_tag_number,
  new.count_tag_prefix,
  new.default_fob,
  new.is_aisle_alpha,
  new.is_bin_alpha,
  new.is_enforce_count_slips,
  new.is_enforce_naming,
  new.is_enforce_zones,
  new.is_location_alpha,
  new.is_rack_alpha,
  new.is_shipping,
  new.location_size,
  new.rack_size,
  new.site_type,
  new.is_active );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.site
  do instead
  
update whsinfo set
  warehous_code = new.code,
  warehous_descrip = new.description,
  warehous_addr_id = new.address,
  warehous_taxzone_id = new.zones,
  warehous_cntct_id =  new.contact,
  warehous_shipcomments = new.shipping_notes,
  warehous_aislesize = new.aisle_size,
  warehous_binsize = new.bin_size,
  warehous_counttag_number = new.count_tag_number,
  warehous_counttag_prefix = new.count_tag_prefix,
  warehous_fob = new.default_fob,
  warehous_aislealpha = new.is_aisle_alpha,
  warehous_binalpha = new.is_bin_alpha,
  warehous_useslips = new.is_enforce_count_slips,
  warehous_enforcearbl = new.is_enforce_naming,
  warehous_usezones = new.is_enforce_zones,
  warehous_locationalpha = new.is_location_alpha,
  warehous_rackalpha = new.is_rack_alpha,
  warehous_shipping = new.is_shipping,
  warehous_locationsize = new.location_size,
  warehous_racksize = new.rack_size,
  warehous_sitetype_id = new.site_type,
  warehous_active = new.is_active
where ( warehous_id = old.guid );

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.site
  do instead (

delete from comment 
where ( comment_source_id = old.guid ) 
  and ( comment_source = \'WH\' );

delete from whsinfo
where ( warehous_id = old.guid );

)

"}',

-- Conditions, Comment, System

'{}', 'Site Model', true);
