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
                
 ------------ ADDRESS -----------
 UNION ALL
 SELECT docass_id AS id,
        addr_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        addr_line1 AS name, addr_line2 AS description,
        docass_purpose AS purpose
        FROM docass, addr
        WHERE ((docass_target_type='ADDR')
        AND (docass_target_id=addr_id))
 UNION ALL
 SELECT docass_id AS id,
        addr_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        addr_line1 AS name, addr_line2 AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, addr
        WHERE ((docass_source_type='ADDR')
        AND (docass_source_id=addr_id))

 ------------ BOM Head -----------
 UNION ALL
 SELECT docass_id AS id,
        bomhead_docnum AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        item_number AS name, firstline(item_descrip1) AS description,
        docass_purpose AS purpose
        FROM docass, bomhead, item
        WHERE ((docass_target_type='BMH')
        AND (docass_target_id=bomhead_id)
        AND (bomhead_item_id=item_id))
 UNION ALL
 SELECT docass_id AS id,
        bomhead_docnum AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        item_number AS name, firstline(item_descrip1) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, bomhead, item
        WHERE ((docass_source_type='BMH')
        AND (docass_source_id=bomhead_id)
        AND (bomhead_item_id=item_id))

 ------------ BOM Item -----------
 UNION ALL
 SELECT docass_id AS id,
        parent.item_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        child.item_number AS name, firstline(child.item_descrip1) AS description,
        docass_purpose AS purpose
        FROM docass, bomitem, item AS parent, item AS child
        WHERE ((docass_target_type='BMI')
        AND (docass_target_id=bomitem_id)
        AND (bomitem_parent_item_id=parent.item_id)
        AND (bomitem_item_id=child.item_id))
 UNION ALL
 SELECT docass_id AS id,
        parent.item_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        child.item_number AS name, firstline(child.item_descrip1) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, bomitem, item AS parent, item AS child
        WHERE ((docass_source_type='BMI')
        AND (docass_source_id=bomitem_id)
        AND (bomitem_parent_item_id=parent.item_id)
        AND (bomitem_item_id=child.item_id))

 ------------ CRM ACCOUNT -----------
 UNION ALL
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

 ------------ CONTRACT -----------
 UNION ALL
 SELECT docass_id AS id,
        contrct_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        vend_name AS name, contrct_descrip AS description,
        docass_purpose AS purpose
        FROM docass, contrct, vendinfo
        WHERE ((docass_target_type='CNTR')
        AND (docass_target_id=contrct_id)
        AND (vend_id=contrct_vend_id))
 UNION ALL
 SELECT docass_id AS id,
        contrct_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        vend_name AS name, contrct_descrip AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, contrct, vendinfo
        WHERE ((docass_source_type='CNTR')
        AND (docass_source_id=contrct_id)
        AND (vend_id=contrct_vend_id))

------------ CREDIT MEMO -----------
 UNION ALL
 SELECT docass_id AS id,
        cmhead_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, firstline(cmhead_comments) AS description,
        docass_purpose AS purpose
        FROM docass, cmhead, custinfo
        WHERE ((docass_target_type='CM')
         AND (docass_target_id=cmhead_id)
         AND (cust_id=cmhead_cust_id))
 UNION ALL
 SELECT docass_id AS id,
        cmhead_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, firstline(cmhead_comments) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, cmhead, custinfo
        WHERE ((docass_source_type='CM')
         AND (docass_source_id=cmhead_id)
         AND (cust_id=cmhead_cust_id))

------------ CREDIT MEMO ITEM -----------
 UNION ALL
 SELECT docass_id AS id,
        cmhead_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, item_number AS description,
        docass_purpose AS purpose
        FROM docass, cmitem, cmhead, custinfo, itemsite, item
        WHERE ((docass_target_type='CMI')
         AND (docass_target_id=cmitem_id)
         AND (cmhead_id=cmitem_cmhead_id)
         AND (cust_id=cmhead_cust_id)
         AND (itemsite_id=cmitem_itemsite_id)
         AND (item_id=itemsite_item_id))
 UNION ALL
 SELECT docass_id AS id,
        cmhead_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, item_number AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, cmitem, cmhead, custinfo, itemsite, item
        WHERE ((docass_source_type='CMI')
         AND (docass_source_id=cmitem_id)
         AND (cmhead_id=cmitem_cmhead_id)
         AND (cust_id=cmhead_cust_id)
         AND (itemsite_id=cmitem_itemsite_id)
         AND (item_id=itemsite_item_id))

 ------------ CUSTOMER -----------
 UNION ALL
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

------------ EMPLOYEE -----------
 UNION ALL
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
         AND (docass_source_id=emp_id))

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

------------ INVOICE ITEM -----------
 UNION ALL
 SELECT docass_id AS id,
        invchead_invcnumber AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, item_number AS description,
        docass_purpose AS purpose
        FROM docass, invcitem, invchead, custinfo, item
        WHERE ((docass_target_type='INVI')
         AND (docass_target_id=invcitem_id)
         AND (invchead_id=invcitem_invchead_id)
         AND (cust_id=invchead_cust_id)
         AND (item_id=invcitem_item_id))
 UNION ALL
 SELECT docass_id AS id,
        invchead_invcnumber AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, item_number AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, invcitem, invchead, custinfo, item
        WHERE ((docass_source_type='INVI')
         AND (docass_source_id=invcitem_id)
         AND (invchead_id=invcitem_invchead_id)
         AND (cust_id=invchead_cust_id)
         AND (item_id=invcitem_item_id))

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

 ------------ ITEM SITE -----------
 UNION ALL
 SELECT docass_id AS id,
        item_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        warehous_code AS name, firstline(item_descrip1) AS description,
        docass_purpose AS purpose
        FROM docass, itemsite, item, whsinfo
        WHERE ((docass_target_type='IS')
        AND (docass_target_id=itemsite_id)
        AND (item_id=itemsite_item_id)
        AND (warehous_id=itemsite_warehous_id))
 UNION ALL
 SELECT docass_id AS id,
        item_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        warehous_code AS name, firstline(item_descrip1) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, itemsite, item, whsinfo
        WHERE ((docass_source_type='IS')
        AND (docass_source_id=itemsite_id)
        AND (item_id=itemsite_item_id)
        AND (warehous_id=itemsite_warehous_id))

 ------------ ITEM SOURCE -----------
 UNION ALL
 SELECT docass_id AS id,
        item_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        vend_name AS name, firstline(item_descrip1) AS description,
        docass_purpose AS purpose
        FROM docass, itemsrc, item, vendinfo
        WHERE ((docass_target_type='IR')
        AND (docass_target_id=itemsrc_id)
        AND (item_id=itemsrc_item_id)
        AND (vend_id=itemsrc_vend_id))
 UNION ALL
 SELECT docass_id AS id,
        item_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        vend_name AS name, firstline(item_descrip1) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, itemsrc, item, vendinfo
        WHERE ((docass_source_type='IR')
        AND (docass_source_id=itemsrc_id)
        AND (item_id=itemsrc_item_id)
        AND (vend_id=itemsrc_vend_id))

 ------------ LOCATION -----------
 UNION ALL
 SELECT docass_id AS id,
        location_formatname AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        warehous_code AS name, '' AS description,
        docass_purpose AS purpose
        FROM docass, location, whsinfo
        WHERE ((docass_target_type='L')
        AND (docass_target_id=location_id)
        AND (warehous_id=location_warehous_id))
 UNION ALL
 SELECT docass_id AS id,
        location_formatname AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        warehous_code AS name, '' AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, location, whsinfo
        WHERE ((docass_source_type='L')
        AND (docass_source_id=location_id)
        AND (warehous_id=location_warehous_id))

 ------------ LOT SERIAL -----------
 UNION ALL
 SELECT docass_id AS id,
        ls_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        item_number AS name, firstLine(item_descrip1) AS description,
        docass_purpose AS purpose
        FROM docass, ls, item
        WHERE ((docass_target_type='LS')
        AND (docass_target_id=ls_id)
        AND (item_id=ls_item_id))
 UNION ALL
 SELECT docass_id AS id,
        ls_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        item_number AS name, firstLine(item_descrip1) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, ls, item
        WHERE ((docass_source_type='LS')
        AND (docass_source_id=ls_id)
        AND (item_id=ls_item_id))

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

 ------------ PROJECT TASK -----------
 UNION ALL
 SELECT docass_id AS id,
        prjtask_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        prjtask_name AS name, firstline(prjtask_descrip) AS description,
        docass_purpose AS purpose
        FROM docass, prjtask
        WHERE ((docass_target_type='TASK')
         AND (docass_target_id=prjtask_id))
 UNION ALL
 SELECT docass_id AS id,
        prjtask_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        prjtask_name AS name, firstline(prjtask_descrip) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, prjtask
        WHERE ((docass_source_type='TASK')
         AND (docass_source_id=prjtask_id)) 

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

 ------------ PURCHASE ORDER ITEM -----------
 UNION ALL
 SELECT docass_id AS id,
        pohead_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        vend_name AS name, item_number AS description,
        docass_purpose AS purpose
        FROM docass, poitem, pohead, vendinfo, itemsite, item
        WHERE ((docass_target_type='PI')
         AND (docass_target_id=poitem_id)
         AND (pohead_id=poitem_pohead_id)
         AND (vend_id=pohead_vend_id)
         AND (itemsite_id=poitem_itemsite_id)
         AND (item_id=itemsite_item_id))
 UNION ALL
 SELECT docass_id AS id,
        pohead_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        vend_name AS name, item_number AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, poitem, pohead, vendinfo, itemsite, item
        WHERE ((docass_source_type='PI')
         AND (docass_source_id=poitem_id)
         AND (pohead_id=poitem_pohead_id)
         AND (vend_id=pohead_vend_id)
         AND (itemsite_id=poitem_itemsite_id)
         AND (item_id=itemsite_item_id))

------------ RETURN AUTHORIZATION -----------
 UNION ALL
 SELECT docass_id AS id,
        rahead_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, firstline(rahead_notes) AS description,
        docass_purpose AS purpose
        FROM docass, rahead, custinfo
        WHERE ((docass_target_type='RA')
         AND (docass_target_id=rahead_id)
         AND (cust_id=rahead_cust_id))
 UNION ALL
 SELECT docass_id AS id,
        rahead_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, firstline(rahead_notes) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, rahead, custinfo
        WHERE ((docass_source_type='RA')
         AND (docass_source_id=rahead_id)
         AND (cust_id=rahead_cust_id))

------------ RETURN AUTHORIZATION ITEM -----------
 UNION ALL
 SELECT docass_id AS id,
        rahead_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, item_number AS description,
        docass_purpose AS purpose
        FROM docass, raitem, rahead, custinfo, itemsite, item
        WHERE ((docass_target_type='RI')
         AND (docass_target_id=raitem_id)
         AND (rahead_id=raitem_rahead_id)
         AND (cust_id=rahead_cust_id)
         AND (itemsite_id=raitem_itemsite_id)
         AND (item_id=itemsite_item_id))
 UNION ALL
 SELECT docass_id AS id,
        rahead_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, item_number AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, raitem, rahead, custinfo, itemsite, item
        WHERE ((docass_source_type='RI')
         AND (docass_source_id=raitem_id)
         AND (rahead_id=raitem_rahead_id)
         AND (cust_id=rahead_cust_id)
         AND (itemsite_id=raitem_itemsite_id)
         AND (item_id=itemsite_item_id))

------------ QUOTE -----------
 UNION ALL
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

------------ QUOTE ITEM -----------
 UNION ALL
 SELECT docass_id AS id,
        quhead_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, item_number AS description,
        docass_purpose AS purpose
        FROM docass, quitem, quhead, custinfo, itemsite, item
        WHERE ((docass_target_type='QI')
         AND (docass_target_id=quitem_id)
         AND (quhead_id=quitem_quhead_id)
         AND (cust_id=quhead_cust_id)
         AND (itemsite_id=quitem_itemsite_id)
         AND (item_id=itemsite_item_id))
 UNION ALL
 SELECT docass_id AS id,
        quhead_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, item_number AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, quitem, quhead, custinfo, itemsite, item
        WHERE ((docass_source_type='QI')
         AND (docass_source_id=quitem_id)
         AND (quhead_id=quitem_quhead_id)
         AND (cust_id=quhead_cust_id)
         AND (itemsite_id=quitem_itemsite_id)
         AND (item_id=itemsite_item_id))

------------ SALES ORDER -----------
 UNION ALL
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

------------ SALES ORDER ITEM -----------
 UNION ALL
 SELECT docass_id AS id,
        cohead_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, item_number AS description,
        docass_purpose AS purpose
        FROM docass, coitem, cohead, custinfo, itemsite, item
        WHERE ((docass_target_type='SI')
         AND (docass_target_id=coitem_id)
         AND (cohead_id=coitem_cohead_id)
         AND (cust_id=cohead_cust_id)
         AND (itemsite_id=coitem_itemsite_id)
         AND (item_id=itemsite_item_id))
 UNION ALL
 SELECT docass_id AS id,
        cohead_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, item_number AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, coitem, cohead, custinfo, itemsite, item
        WHERE ((docass_source_type='SI')
         AND (docass_source_id=coitem_id)
         AND (cohead_id=coitem_cohead_id)
         AND (cust_id=cohead_cust_id)
         AND (itemsite_id=coitem_itemsite_id)
         AND (item_id=itemsite_item_id))

 ------------ SHIP TO -----------
 UNION ALL
 SELECT docass_id AS id,
        shipto_num AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        cust_name AS name, shipto_name AS description,
        docass_purpose AS purpose
        FROM docass, shiptoinfo, custinfo
        WHERE ((docass_target_type='SHP')
         AND (docass_target_id=shipto_id)
         AND (cust_id=shipto_cust_id))
 UNION ALL
 SELECT docass_id AS id,
        shipto_num AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        cust_name AS name, shipto_name AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, shiptoinfo, custinfo
        WHERE ((docass_source_type='SHP')
         AND (docass_source_id=shipto_id)
         AND (cust_id=shipto_cust_id))

------------ TO DO -----------
 UNION ALL
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

------------ VOUCHER -----------
 UNION ALL
 SELECT docass_id AS id,
        vohead_number AS target_number,
        docass_target_type AS target_type,
        docass_target_id AS target_id,
        docass_source_type AS source_type,
        docass_source_id AS source_id,
        vend_name AS name, firstline(vohead_notes) AS description,
        docass_purpose AS purpose
        FROM docass, vohead, vendinfo
        WHERE ((docass_target_type='VCH')
        AND (docass_target_id=vohead_id)
        AND (vend_id=vohead_vend_id))
 UNION ALL
 SELECT docass_id AS id,
        vohead_number AS target_number,
        docass_source_type AS target_type,
        docass_source_id AS target_id,
        docass_target_type AS source_type,
        docass_target_id AS source_id,
        vend_name AS name, firstline(vohead_notes) AS description,
        CASE 
          WHEN docass_purpose = 'A' THEN 'C'
          WHEN docass_purpose = 'C' THEN 'A'
          ELSE docass_purpose
        END AS purpose
        FROM docass, vohead, vendinfo
        WHERE ((docass_source_type='VCH')
        AND (docass_source_id=vohead_id)
        AND (vend_id=vohead_vend_id))

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
;

REVOKE ALL ON TABLE docinfo FROM PUBLIC;
GRANT  ALL ON TABLE docinfo TO GROUP xtrole;
