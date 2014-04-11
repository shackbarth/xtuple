
SELECT dropIfExists('VIEW', 'vendaddr');
CREATE VIEW vendaddr AS
  SELECT vendaddr_id, vendaddr_vend_id, vendaddr_code, vendaddr_name,
        m.addr_line1    AS vendaddr_address1,
        m.addr_line2    AS vendaddr_address2,
        m.addr_line3    AS vendaddr_address3,
        trim(c1.cntct_first_name || ' ' || c1.cntct_last_name) AS vendaddr_contact1,
        c1.cntct_phone  AS vendaddr_phone1,
        c1.cntct_fax    AS vendaddr_fax1,
        m.addr_city     AS vendaddr_city,
        m.addr_state    AS vendaddr_state,
        m.addr_postalcode AS vendaddr_zipcode,
        m.addr_country  AS vendaddr_country
FROM vendaddrinfo LEFT OUTER JOIN cntct c1  ON (vendaddr_cntct_id=c1.cntct_id)
                  LEFT OUTER JOIN addr m    ON (vendaddr_addr_id=m.addr_id);

REVOKE ALL ON TABLE vendaddr FROM PUBLIC;
GRANT  ALL ON TABLE vendaddr TO GROUP xtrole;

