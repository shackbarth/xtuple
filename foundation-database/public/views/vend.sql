SELECT dropIfExists('VIEW', 'vend');

CREATE OR REPLACE VIEW vend AS 
 SELECT vendinfo.vend_id, vendinfo.vend_name, m.addr_line1 AS vend_address1, m.addr_line2 AS vend_address2, m.addr_line3 AS vend_address3, m.addr_city AS vend_city, m.addr_state AS vend_state, m.addr_postalcode AS vend_zip, btrim((c1.cntct_first_name || ' '::text) || c1.cntct_last_name) AS vend_contact1, c1.cntct_phone AS vend_phone1, btrim((c2.cntct_first_name || ' '::text) || c2.cntct_last_name) AS vend_contact2, c2.cntct_phone AS vend_phone2, vendinfo.vend_lastpurchdate, vendinfo.vend_active, vendinfo.vend_po, vendinfo.vend_comments, vendinfo.vend_pocomments, vendinfo.vend_number, c1.cntct_fax AS vend_fax1, c2.cntct_fax AS vend_fax2, c1.cntct_email AS vend_email1, c2.cntct_email AS vend_email2, vendinfo.vend_1099, vendinfo.vend_exported, vendinfo.vend_fobsource, vendinfo.vend_fob, vendinfo.vend_terms_id, vendinfo.vend_shipvia, vendinfo.vend_vendtype_id, vendinfo.vend_qualified, vendinfo.vend_ediemail, vendinfo.vend_ediemailbody, vendinfo.vend_edisubject, vendinfo.vend_edifilename, vendinfo.vend_accntnum, vendinfo.vend_emailpodelivery, vendinfo.vend_restrictpurch, vendinfo.vend_edicc, m.addr_country AS vend_country, vendinfo.vend_curr_id, vendinfo.vend_taxzone_id
   FROM vendinfo
   LEFT JOIN cntct c1 ON vendinfo.vend_cntct1_id = c1.cntct_id
   LEFT JOIN addr m ON vendinfo.vend_addr_id = m.addr_id
   LEFT JOIN cntct c2 ON vendinfo.vend_cntct2_id = c2.cntct_id;

ALTER TABLE vend OWNER TO "admin";
GRANT SELECT, UPDATE, INSERT, DELETE, REFERENCES, TRIGGER ON TABLE vend TO "admin";
GRANT SELECT, UPDATE, INSERT, DELETE, REFERENCES, TRIGGER ON TABLE vend TO xtrole;
