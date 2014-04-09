  --Site (aka Warehouse) View

  SELECT dropIfExists('VIEW', 'site', 'api');
  CREATE OR REPLACE VIEW api.site AS
 
  SELECT 
    warehous_code::VARCHAR AS code,
    st.sitetype_name AS type,
    warehous_active AS active,
    warehous_descrip AS description,
    m.addr_number AS address_number,
    m.addr_line1 AS address1,
    m.addr_line2 AS address2,
    m.addr_line3 AS address3,
    m.addr_city AS city,
    m.addr_state AS state,
    m.addr_postalcode AS postal_code,
    m.addr_country AS country,
    (''::TEXT) AS address_change,
    c.cntct_number AS contact_number,
    c.cntct_honorific AS honorific,
    c.cntct_first_name AS first,
    c.cntct_middle as middle,
    c.cntct_last_name AS last,
    c.cntct_suffix AS suffix,
    c.cntct_title AS job_title,
    c.cntct_phone AS phone,
    c.cntct_fax AS fax,
    c.cntct_email AS email,
    (''::TEXT) AS contact_change,
    formatGLAccount(a.accnt_id) AS post_unassigned_transactions_to,
    a.accnt_descrip AS post_unassigned_transactions_to_description,
    warehous_transit AS transit_type,
    CASE
      WHEN warehous_transit THEN
        false
      ELSE
        true
    END AS inventory_type,
-- Inventory Sites Exclusive
    CASE
      WHEN warehous_transit THEN
        ''
      ELSE
        warehous_bol_prefix
    END AS next_bill_of_lading_prefix,
    CASE
      WHEN warehous_transit THEN
        0
      ELSE
        warehous_bol_number
    END AS next_bill_of_lading_number,
    CASE
      WHEN warehous_transit THEN
        false
      ELSE warehous_shipping
    END AS shipping_site,
    CASE
      WHEN warehous_transit THEN
        ''
      ELSE
        warehous_counttag_prefix
    END AS next_count_tag_prefix,
    CASE
      WHEN warehous_transit THEN
        0
      ELSE
        warehous_counttag_number
    END AS next_count_tag_number,
    CASE
      WHEN warehous_transit THEN
        false
      ELSE warehous_useslips
    END AS force_the_use_of_count_slips,
    CASE
      WHEN warehous_transit THEN
        false
      ELSE warehous_usezones
    END AS force_the_use_of_zones,
    CASE
      WHEN warehous_transit THEN
        0
      ELSE
        warehous_sequence
    END AS scheduling_sequence,
    CASE
      WHEN warehous_transit THEN
        0
      ELSE
        (warehous_shipping_commission * 100.0)
    END AS shipping_commission,
    CASE
      WHEN warehous_transit THEN
        ''
      ELSE
        t.taxzone_code
    END AS tax_zone,
    CASE
      WHEN warehous_transit THEN
        ''
      ELSE
        warehous_fob
    END AS default_fob,
-- Transit Sites Exclusive
    CASE
      WHEN warehous_transit THEN
        s.shipvia_code
      ELSE
        ''
    END AS default_ship_via,
    CASE
      WHEN warehous_transit THEN
        f.shipform_name
      ELSE
        ''
    END AS default_shipping_form,
    CASE
      WHEN warehous_transit THEN
        cc.costcat_code
      ELSE
        ''
    END AS default_cost_category,
    CASE
      WHEN warehous_transit THEN
        warehous_shipcomments
      ELSE
        ''
    END AS shipping_comments,
-- Inventory Sites Exclusive
    CASE
      WHEN warehous_transit THEN
        false
      ELSE warehous_enforcearbl
    END AS enforce_arbl_naming_convention,
    CASE
      WHEN warehous_transit THEN
        0
      WHEN warehous_enforcearbl THEN
        warehous_aislesize
      ELSE
        0
    END AS aisle_size,
    CASE
      WHEN warehous_transit THEN
        false
      WHEN (warehous_enforcearbl AND warehous_aislealpha) THEN
        true
      ELSE
        false
    END AS aisle_allow_alpha_characters,
    CASE
      WHEN warehous_transit THEN
        0
      WHEN warehous_enforcearbl THEN
        warehous_racksize
      ELSE
        0
    END AS rack_size,
    CASE
      WHEN warehous_transit THEN
        false
      WHEN (warehous_enforcearbl AND warehous_rackalpha) THEN
        true
      ELSE
        false
    END AS rack_allow_alpha_characters,
    CASE
      WHEN warehous_transit THEN
        0
      WHEN warehous_enforcearbl THEN
        warehous_binsize
      ELSE
        0
    END AS bin_size,
    CASE
      WHEN warehous_transit THEN
        false
      WHEN (warehous_enforcearbl AND warehous_binalpha) THEN
        true
      ELSE
        false
    END AS bin_allow_alpha_characters,
    CASE
      WHEN warehous_transit THEN
        0
      WHEN warehous_enforcearbl THEN
        warehous_locationsize
      ELSE
        0
    END AS location_size,
    CASE
      WHEN warehous_transit THEN
        false
      WHEN (warehous_enforcearbl AND warehous_locationalpha) THEN
        true
      ELSE
        false
    END AS location_allow_alpha_characters
  FROM
    whsinfo
      LEFT OUTER JOIN addr m ON (warehous_addr_id=m.addr_id)
      LEFT OUTER JOIN cntct c ON (warehous_cntct_id=c.cntct_id)
      LEFT OUTER JOIN accnt a ON (warehous_default_accnt_id=a.accnt_id)
      LEFT OUTER JOIN taxzone t ON (warehous_taxzone_id=t.taxzone_id)
      LEFT OUTER JOIN shipvia s ON (warehous_shipvia_id=s.shipvia_id)
      LEFT OUTER JOIN shipform f ON (warehous_shipform_id=f.shipform_id)
      LEFT OUTER JOIN costcat cc ON (warehous_costcat_id=cc.costcat_id)
      LEFT OUTER JOIN sitetype st ON (warehous_sitetype_id=st.sitetype_id)
  ORDER BY warehous_code;

GRANT ALL ON TABLE api.site TO xtrole;
COMMENT ON VIEW api.site IS 'Site';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.site DO INSTEAD

  INSERT INTO whsinfo (
    warehous_code,
    warehous_descrip,
    warehous_fob,
    warehous_active,
    warehous_counttag_prefix,
    warehous_counttag_number,
    warehous_bol_prefix,
    warehous_bol_number,
    warehous_shipping,
    warehous_useslips,
    warehous_usezones,
    warehous_aislesize,
    warehous_aislealpha,
    warehous_racksize,
    warehous_rackalpha,
    warehous_binsize,
    warehous_binalpha,
    warehous_locationsize,
    warehous_locationalpha,
    warehous_enforcearbl,
    warehous_default_accnt_id,
    warehous_shipping_commission,
    warehous_cntct_id,
    warehous_addr_id,
    warehous_taxzone_id,
    warehous_transit,
    warehous_shipform_id,
    warehous_shipvia_id,
    warehous_shipcomments,
    warehous_costcat_id,
    warehous_sitetype_id,
    warehous_sequence
    )
  VALUES (
    COALESCE(NEW.code, ''),
    COALESCE(NEW.description, ''),
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.default_fob, '')
      ELSE
        ''
    END,
    COALESCE(NEW.active,true),
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.next_count_tag_prefix, '')
          ELSE
        ''
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.next_count_tag_number, 0)
      ELSE
        0
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.next_bill_of_lading_prefix, '')
      ELSE
        ''
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.next_bill_of_lading_number, 0)
      ELSE
        0
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.shipping_site, false)
      ELSE
        false
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.force_the_use_of_count_slips, false)
      ELSE
        false
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.force_the_use_of_zones, false)
      ELSE
        false
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.aisle_size, 0)
      ELSE
        0
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.aisle_allow_alpha_characters, false)
      ELSE
        false
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.rack_size, 0)
      ELSE
        0
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.rack_allow_alpha_characters, false)
      ELSE
        false
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.bin_size, 0)
      ELSE
        0
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.bin_allow_alpha_characters, false)
      ELSE
        false
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.location_size, 0)
      ELSE
        0
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.location_allow_alpha_characters, false)
      ELSE
        false
    END,
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.enforce_arbl_naming_convention, false)
      ELSE
        false
    END,
    COALESCE(getglaccntid(NEW.post_unassigned_transactions_to), -1),
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(NEW.shipping_commission * .01, 0)
      ELSE
        0
    END,
    saveCntct(
      getCntctId(NEW.contact_number),
      NEW.contact_number,
      NULL,
      NEW.honorific,
      NEW.first,
      NEW.middle,
      NEW.last,
      NEW.suffix,
      NEW.phone,
      NULL,
      NEW.fax,
      NEW.email,
      NULL,
      NEW.job_title,
      NEW.contact_change),
    saveAddr(
      getAddrId(NEW.address_number),
      NEW.address_number,
      NEW.address1,
      NEW.address2,
      NEW.address3,
      NEW.city,
      NEW.state,
      NEW.postal_code,
      NEW.country,
      NEW.address_change),
    CASE
      WHEN NEW.inventory_type THEN
        COALESCE(getTaxZoneId(NEW.tax_zone), -1)
      ELSE
        NULL
    END,
    CASE
      WHEN NEW.inventory_type THEN
        false
      WHEN NEW.transit_type THEN
        true
      ELSE
        false
    END,
    CASE
      WHEN NEW.transit_type THEN
        COALESCE(getShipFormId(NEW.default_shipping_form), FetchMetricValue('DefaultShipFormId'))
      ELSE
        NULL
    END,
    CASE
      WHEN NEW.transit_type THEN
        COALESCE(getShipViaId(NEW.default_ship_via), FetchMetricValue('DefaultShipViaId'))
      ELSE
        NULL
    END,
    CASE
      WHEN NEW.transit_type THEN
        COALESCE(NEW.shipping_comments, '')
      ELSE
        ''
    END,
    CASE
      WHEN NEW.transit_type THEN
        COALESCE(getCostCatId(NEW.default_cost_category), -1)
      ELSE
        NULL
    END,
    COALESCE(getSiteTypeId(NEW.type), -1),
    COALESCE(NEW.scheduling_sequence, 0)
    );

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.site DO INSTEAD

  UPDATE whsinfo SET
    warehous_descrip=NEW.description,
    warehous_fob=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.default_fob
        ELSE
          NULL
      END,
    warehous_active=NEW.active,
    warehous_counttag_prefix=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.next_count_tag_prefix
        ELSE
          NULL
        END,
    warehous_counttag_number=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.next_count_tag_number
        ELSE
          NULL
      END,
    warehous_bol_prefix=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.next_bill_of_lading_prefix
        ELSE
          NULL
      END,
    warehous_bol_number=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.next_bill_of_lading_number
        ELSE
          NULL
      END,
    warehous_shipping=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.shipping_site
        ELSE
          NULL
      END,
    warehous_useslips=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.force_the_use_of_count_slips
        ELSE
          NULL
      END,
    warehous_usezones=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.force_the_use_of_zones
        ELSE
          NULL
      END,
    warehous_aislesize=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.aisle_size
        ELSE
          NULL
      END,
    warehous_aislealpha=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.aisle_allow_alpha_characters
        ELSE
          NULL
      END,
    warehous_racksize=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.rack_size
        ELSE
          NULL
      END,
    warehous_rackalpha=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.rack_allow_alpha_characters
        ELSE
          NULL
      END,
    warehous_binsize=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.bin_size
        ELSE
          NULL
      END,
    warehous_binalpha=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.bin_allow_alpha_characters
        ELSE
          NULL
      END,
    warehous_locationsize=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.location_size
        ELSE
          NULL
      END,
    warehous_locationalpha=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.location_allow_alpha_characters
        ELSE
          NULL
      END,
    warehous_enforcearbl=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.enforce_arbl_naming_convention
        ELSE
          NULL
      END,
    warehous_default_accnt_id=getglaccntid(NEW.post_unassigned_transactions_to),
    warehous_shipping_commission=
      CASE
        WHEN NEW.inventory_type THEN
          NEW.shipping_commission * .01
        ELSE
          NULL
      END,
    warehous_cntct_id=
      saveCntct(
        getCntctId(NEW.contact_number),
        NEW.contact_number,
        NULL,
        NEW.honorific,
        NEW.first,
        NEW.middle,
        NEW.last,
        NEW.suffix,
        NEW.phone,
        NULL,
        NEW.fax,
        NEW.email,
        NULL,
        NEW.job_title,
        NEW.contact_change),
    warehous_addr_id=
      saveAddr(
        getAddrId(NEW.address_number),
        NEW.address_number,
        NEW.address1,
        NEW.address2,
        NEW.address3,
        NEW.city,
        NEW.state,
        NEW.postal_code,
        NEW.country,
        NEW.address_change),
    warehous_taxzone_id=
      CASE
        WHEN NEW.inventory_type THEN
          getTaxZoneId(NEW.tax_zone)
        ELSE
          NULL
      END,
    warehous_transit=
      CASE
        WHEN NEW.inventory_type THEN
          false
        WHEN NEW.transit_type THEN
          true
        ELSE
          NULL
      END,
    warehous_shipform_id=
      CASE
        WHEN NEW.transit_type THEN
          getShipFormId(NEW.default_shipping_form)
        ELSE
          NULL
      END,
    warehous_shipvia_id=
      CASE
        WHEN NEW.transit_type THEN
          getShipViaId(NEW.default_ship_via)
        ELSE
          NULL
      END,
    warehous_shipcomments=
      CASE
        WHEN NEW.transit_type THEN
          NEW.shipping_comments
        ELSE
          NULL
      END,
    warehous_costcat_id=
      CASE
        WHEN NEW.transit_type THEN
          getCostCatId(NEW.default_cost_category)
        ELSE
          NULL
      END,
    warehous_sitetype_id=getSiteTypeId(NEW.type),
    warehous_sequence=NEW.scheduling_sequence

  WHERE  (warehous_id=getWarehousId(OLD.code, 'ALL'));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.site DO NOTHING;
