
SELECT dropIfExists('VIEW', 'warehous');
CREATE VIEW warehous AS
  SELECT warehous_id, warehous_code, warehous_descrip,
    m.addr_line1        AS warehous_addr1,
    m.addr_line2        AS warehous_addr2,
    m.addr_line3        AS warehous_addr3,
    m.addr_city         AS warehous_addr4, -- backward compatibility
    m.addr_city         AS warehous_city,
    m.addr_state        AS warehous_state,
    m.addr_postalcode   AS warehous_zip,
    m.addr_country      AS warehous_country,
    warehous_fob,
    warehous_active,
    warehous_sitetype_id,
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
    warehous_shipping_commission

FROM whsinfo LEFT OUTER JOIN cntct c1  ON (warehous_cntct_id=c1.cntct_id)
             LEFT OUTER JOIN addr m    ON (warehous_addr_id=m.addr_id);

REVOKE ALL ON TABLE warehous FROM PUBLIC;
GRANT  ALL ON TABLE warehous TO GROUP xtrole;

