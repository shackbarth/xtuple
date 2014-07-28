SELECT dropIfExists('VIEW','docinfo');
CREATE VIEW docinfo AS
------------ IMAGE -----------
 SELECT imageass_id AS id,
        image_id::text AS target_number,
        'IMG' AS target_type,
        imageass_image_id AS target_id,
        imageass_source AS source_type,
        imageass_source_id AS source_id,
        image_name AS name, image_descrip AS description,
        imageass_purpose AS purpose
        FROM imageass, image
        WHERE (imageass_image_id=image_id)
------------ URL (file and website) -----------
 UNION ALL
 SELECT url_id AS id, 
        url_id::text AS target_number,
        'URL' AS target_type,
        url_id AS target_id,
        url_source AS source_type,
        url_source_id AS source_id, 
        url_title AS name, url_url AS description,
        'S' AS doc_purpose
        FROM url
 WHERE (url_stream IS NULL)
 UNION ALL
 SELECT url_id AS id, 
        url_id::text AS target_number,
        'FILE' AS target_type,
        url_id AS target_id,
        url_source AS source_type,
        url_source_id AS source_id, 
        url_title AS name, url_url AS description,
        'S' AS doc_purpose
        FROM url
 WHERE (url_stream IS NOT NULL)
                
------------ INCIDENT -----------
 UNION ALL
 SELECT docass_id AS id,
        incdt_number::text AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        incdt_summary AS name, 
        firstline(incdt_descrip) AS description,
        docass_purpose AS purpose
        FROM docass, incdt
        WHERE ((docass_target_type='INCDT')
         AND (docass_target_id=incdt_id))
 UNION ALL
 SELECT docass_id AS id,
        incdt_number::text AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        incdt_summary AS name, 
        firstline(incdt_descrip) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, incdt
        WHERE ((docass_source_type='INCDT')
         AND (docass_source_id=incdt_id))  
 UNION ALL
------------ TO DO -----------
 SELECT docass_id AS id,
        todoitem_id::text AS target_number,
        docass_target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        todoitem_name AS name, 
        firstline(todoitem_description) AS description,
        docass_purpose AS purpose
        FROM docass, todoitem
         WHERE ((docass_target_type='TODO')
         AND (docass_target_id=todoitem_id))
 UNION ALL
 SELECT docass_id AS id,
        todoitem_id::text AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        todoitem_name AS name, 
        firstline(todoitem_description) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, todoitem
         WHERE ((docass_source_type='TODO')
         AND (docass_source_id=todoitem_id))
 ------------ PROJECT -----------
 UNION ALL
 SELECT docass_id AS id,
        prj_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        prj_name AS name, firstline(prj_descrip) AS description,
        docass_purpose AS purpose
        FROM docass, prj
        WHERE ((docass_target_type='J')
         AND (docass_target_id=prj_id))
 UNION ALL
 SELECT docass_id AS id,
        prj_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        prj_name AS name, firstline(prj_descrip) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, prj
        WHERE ((docass_source_type='J')
         AND (docass_source_id=prj_id)) 
 ------------ ITEM -----------
 UNION ALL
 SELECT docass_id AS id,
        item_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        firstline(item_descrip1) AS name, firstline(item_descrip2) AS description,
        docass_purpose AS purpose
        FROM docass, item
        WHERE ((docass_target_type='I')
        AND (docass_target_id=item_id))
 UNION ALL
 SELECT docass_id AS id,
        item_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        firstline(item_descrip1) AS name, firstline(item_descrip2) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, item
        WHERE ((docass_source_type='I')
        AND (docass_source_id=item_id))
 UNION ALL
 ------------ CRM ACCOUNT -----------
 SELECT docass_id AS id,
        crmacct_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        crmacct_name AS name,
        firstline(crmacct_notes) AS description,
        docass_purpose AS purpose
             FROM docass, crmacct
             WHERE ((docass_target_type='CRMA')
             AND (docass_target_id=crmacct_id))
 UNION ALL
 SELECT docass_id AS id,
        crmacct_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        crmacct_name AS name,
        firstline(crmacct_notes) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, crmacct
        WHERE ((docass_source_type='CRMA')
         AND (docass_source_id=crmacct_id))
 ------------ CUSTOMER -----------
 UNION
 SELECT docass_id AS id,
        cust_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, firstline(cust_comments) AS description,
        docass_purpose AS purpose
        FROM docass, custinfo
        WHERE ((docass_target_type='C')
         AND (docass_target_id=cust_id))
 UNION ALL
 SELECT docass_id AS id,
        cust_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, firstline(cust_comments) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, custinfo
        WHERE ((docass_source_type='C')
         AND (docass_source_id=cust_id))
------------ VENDOR -----------
 UNION ALL
 SELECT docass_id AS id,
        vend_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        vend_name AS name, firstline(vend_comments) AS description,
        docass_purpose AS purpose
        FROM docass, vendinfo
        WHERE ((docass_target_type='V')
        AND (docass_target_id=vend_id))
 UNION ALL
 SELECT docass_id AS id,
        vend_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        vend_name AS name, firstline(vend_comments) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, vendinfo
        WHERE ((docass_source_type='V')
        AND (docass_source_id=vend_id))
 ------------ CONTACT -----------
 UNION ALL
 SELECT docass_id AS id,
        cntct_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cntct_name AS name, cntct_title AS description,
        docass_purpose AS purpose
        FROM docass, cntct
        WHERE ((docass_target_type='T')
        AND (docass_target_id=cntct_id))
 UNION ALL
 SELECT docass_id AS id,
        cntct_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cntct_name AS name, cntct_title AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, cntct
        WHERE ((docass_source_type='T')
        AND (docass_source_id=cntct_id))
 ------------ OPPORTUNITY -----------
 UNION ALL
 SELECT docass_id AS id,
        ophead_id::text AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        ophead_name AS name, firstline(ophead_notes) AS description,
        docass_purpose AS purpose
        FROM docass, ophead
        WHERE ((docass_target_type='OPP')
         AND (docass_target_id=ophead_id))
 UNION ALL
 SELECT docass_id AS id,
        ophead_id::text AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        ophead_name AS name, firstline(ophead_notes) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, ophead
        WHERE ((docass_source_type='OPP')
         AND (docass_source_id=ophead_id))
 UNION ALL
------------ QUOTE -----------
 SELECT docass_id AS id,
        quhead_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, firstline(quhead_ordercomments) AS description,
        docass_purpose AS purpose
        FROM docass, quhead, custinfo
        WHERE ((docass_target_type='Q')
         AND (docass_target_id=quhead_id)
         AND (cust_id=quhead_cust_id))
 UNION ALL
 SELECT docass_id AS id,
        quhead_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, firstline(quhead_ordercomments) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, quhead, custinfo
        WHERE ((docass_source_type='Q')
         AND (docass_source_id=quhead_id)
         AND (cust_id=quhead_cust_id))
 UNION ALL
------------ SALES ORDER -----------
 SELECT docass_id AS id,
        cohead_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, firstline(cohead_ordercomments) AS description,
        docass_purpose AS purpose
        FROM docass, cohead, custinfo
        WHERE ((docass_target_type='S')
         AND (docass_target_id=cohead_id)
         AND (cust_id=cohead_cust_id))
 UNION ALL
 SELECT docass_id AS id,
        cohead_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, firstline(cohead_ordercomments) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, cohead, custinfo
        WHERE ((docass_source_type='S')
         AND (docass_source_id=cohead_id)
         AND (cust_id=cohead_cust_id))
------------ INVOICE -----------
 UNION ALL
 SELECT docass_id AS id,
        invchead_invcnumber AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, firstline(invchead_notes) AS description,
        docass_purpose AS purpose
        FROM docass, invchead, custinfo
        WHERE ((docass_target_type='INV')
         AND (docass_target_id=invchead_id)
         AND (cust_id=invchead_cust_id))
 UNION ALL
 SELECT docass_id AS id,
        invchead_invcnumber AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, firstline(invchead_notes) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, invchead, custinfo
        WHERE ((docass_source_type='INV')
         AND (docass_source_id=invchead_id)
         AND (cust_id=invchead_cust_id))
 ------------ PURCHASE ORDER -----------
 UNION ALL
 SELECT docass_id AS id,
        pohead_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        vend_name AS name, firstline(pohead_comments) AS description,
        docass_purpose AS purpose
        FROM docass, pohead, vendinfo
        WHERE ((docass_target_type='P')
         AND (docass_target_id=pohead_id)
         AND (vend_id=pohead_vend_id))
 UNION ALL
 SELECT docass_id AS id,
        pohead_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        vend_name AS name, firstline(pohead_comments) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, pohead, vendinfo
        WHERE ((docass_source_type='P')
         AND (docass_source_id=pohead_id)
         AND (vend_id=pohead_vend_id))
------------ WORK ORDER -----------
 UNION ALL
 SELECT docass_id AS id,
        formatWoNumber(wo_id) AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        item_descrip1 AS name, item_descrip2 AS description,
        docass_purpose AS purpose
        FROM docass, wo, itemsite, item
        WHERE ((docass_target_type='W')
         AND (docass_target_id=wo_id)
         AND (wo_itemsite_id=itemsite_id)
         AND (itemsite_item_id=item_id))
 UNION ALL
 SELECT docass_id AS id,
        formatWoNumber(wo_id) AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        item_descrip1 AS name, item_descrip2 AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, wo, itemsite, item
        WHERE ((docass_source_type='W')
         AND (docass_source_id=wo_id)
         AND (wo_itemsite_id=itemsite_id)
         AND (itemsite_item_id=item_id))
UNION ALL
------------ EMPLOYEE -----------
 SELECT docass_id AS id,
        emp_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cntct_name AS name, cntct_title AS description,
        docass_purpose AS purpose
        FROM docass, emp
          LEFT OUTER JOIN cntct ON (emp_cntct_id=cntct_id)
        WHERE ((docass_target_type='EMP')
         AND (docass_target_id=emp_id))
 UNION ALL
 SELECT docass_id AS id,
        emp_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cntct_name AS name, cntct_title AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, emp
          LEFT OUTER JOIN cntct ON (emp_cntct_id=cntct_id)
        WHERE ((docass_source_type='EMP')
         AND (docass_source_id=emp_id));

REVOKE ALL ON TABLE docinfo FROM PUBLIC;
GRANT  ALL ON TABLE docinfo TO GROUP xtrole;
