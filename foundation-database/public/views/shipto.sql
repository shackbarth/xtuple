
SELECT dropIfExists('VIEW', 'shipto');
CREATE OR REPLACE VIEW shipto AS
  SELECT shipto_id, shipto_cust_id, shipto_name,
        m.addr_line1    AS shipto_address1,
        m.addr_line2    AS shipto_address2,
        m.addr_line3    AS shipto_address3,
        m.addr_city     AS shipto_city,
        m.addr_state    AS shipto_state,
        m.addr_postalcode AS shipto_zipcode,
        shipto_taxzone_id,
        shipto_salesrep_id,
        c1.cntct_phone  AS shipto_phone,
        shipto_comments,
        shipto_shipcomments,
        trim(c1.cntct_first_name || ' ' || c1.cntct_last_name) AS shipto_contact,
        c1.cntct_fax    AS shipto_fax,
        c1.cntct_email  AS shipto_email,
        shipto_shipzone_id,
        shipto_shipvia,
        shipto_commission,
        shipto_shipform_id,
        shipto_shipchrg_id,
        shipto_active,
        shipto_default,
        shipto_num,
        shipto_ediprofile_id,
        m.addr_country  AS shipto_country

FROM shiptoinfo LEFT OUTER JOIN cntct c1  ON (shipto_cntct_id=c1.cntct_id)
                LEFT OUTER JOIN addr m    ON (shipto_addr_id=m.addr_id);

REVOKE ALL ON TABLE shipto FROM PUBLIC;
GRANT  ALL ON TABLE shipto TO GROUP xtrole;

