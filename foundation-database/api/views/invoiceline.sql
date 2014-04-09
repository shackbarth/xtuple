CREATE OR REPLACE RULE "_INSERT" AS
	ON INSERT TO api.invoiceline DO INSTEAD NOTHING;
CREATE OR REPLACE RULE "_UPDATE" AS
	ON UPDATE TO api.invoiceline DO INSTEAD NOTHING;
SELECT dropIfExists('FUNCTION', 'insertInvoiceLineItem(api.invoiceline)');
SELECT dropIfExists('FUNCTION', 'updateInvoiceLineItem(api.invoiceline, api.invoiceline)');
SELECT dropIfExists('VIEW', 'invoiceline', 'api');
CREATE OR REPLACE VIEW api.invoiceline
AS
	SELECT
		invchead_invcnumber AS invoice_number,
		invcitem_linenumber AS line_number,
		item_number,
		invcitem_number AS misc_item_number,
		warehous_code AS site,
		invcitem_descrip AS misc_item_description,
		salescat_name as sales_category,
		invcitem_custpn AS customer_part_number,
		invcitem_ordered AS qty_ordered,
		invcitem_billed AS qty_billed,
                invcitem_updateinv AS update_inventory,
		invcitem_price AS net_unit_price,
		COALESCE(taxtype_name, 'None') AS tax_type,
		COALESCE(qty_uom.uom_name, 'None') AS qty_uom,
		COALESCE(price_uom.uom_name, 'None') AS price_uom,
		invcitem_notes AS notes,
                CASE WHEN (invcitem_rev_accnt_id IS NOT NULL) THEN formatglaccount(invcitem_rev_accnt_id)
                     ELSE NULL::text
                END AS alternate_rev_account
	FROM invcitem
		LEFT OUTER JOIN invchead ON (invcitem_invchead_id=invchead_id)
		LEFT OUTER JOIN item ON (item_id=invcitem_item_id)
		LEFT OUTER JOIN whsinfo ON (invcitem_warehous_id=warehous_id)
		LEFT OUTER JOIN salescat ON (salescat_id=invcitem_salescat_id)
		LEFT OUTER JOIN taxtype ON (taxtype_id=invcitem_taxtype_id)
		LEFT OUTER JOIN uom AS qty_uom ON (qty_uom.uom_id=invcitem_qty_uom_id)
		LEFT OUTER JOIN uom AS price_uom ON (price_uom.uom_id=invcitem_price_uom_id);
	
GRANT ALL ON TABLE api.invoiceline TO xtrole;
COMMENT ON VIEW api.invoiceline IS '
This view can be used as an interface to import Invoice Line Items data directly
into the system.  Required fields will be checked and default values will be
populated';


CREATE OR REPLACE FUNCTION insertInvoiceLineItem(api.invoiceline) RETURNS BOOLEAN AS
$insertInvoiceLineItem$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
	pNew ALIAS FOR $1;
	_r RECORD;
BEGIN
	INSERT INTO invcitem (
		invcitem_invchead_id,
		invcitem_linenumber,
		invcitem_item_id,
		invcitem_warehous_id,
		invcitem_custpn,
		invcitem_number,
		invcitem_descrip,
		invcitem_ordered,
		invcitem_billed,
                invcitem_updateinv,
		invcitem_custprice,
		invcitem_price,
		invcitem_notes,
		invcitem_salescat_id,
		invcitem_taxtype_id,
		invcitem_qty_uom_id,
		invcitem_qty_invuomratio,
		invcitem_price_uom_id,
		invcitem_price_invuomratio,
                invcitem_rev_accnt_id
	) SELECT
		invchead_id,
		COALESCE(pNew.line_number,(
			SELECT (COALESCE(MAX(invcitem_linenumber), 0) + 1)
			FROM invcitem WHERE (invcitem_invchead_id=invchead_id)
		)),
		COALESCE(item_id, -1),
		COALESCE(getwarehousid(pNew.site,'ALL'),-1),
		pNew.customer_part_number,
		(CASE WHEN item_id IS NULL THEN pNew.misc_item_number ELSE NULL END),
		(CASE WHEN item_id IS NULL THEN pNew.misc_item_description ELSE NULL END),
		pNew.qty_ordered,
		COALESCE(pNew.qty_billed, 0),
                COALESCE(pNew.update_inventory,FALSE),
		0, -- invcitem_custprice
		COALESCE(pNew.net_unit_price,itemPrice(item_id,invchead_cust_id,
			invchead_shipto_id,pNew.qty_ordered,invchead_curr_id,invchead_orderdate)),
		COALESCE(pNew.notes,''),
		CASE
			WHEN item_id IS NULL THEN
				(SELECT salescat_id FROM salescat WHERE salescat_name = pNew.sales_category)
			ELSE NULL
		END,
		taxtype_id,
		CASE
			WHEN item_id IS NOT NULL THEN
				COALESCE((SELECT uom_id FROM uom WHERE (uom_name=pNew.qty_uom)), item_price_uom_id)
			ELSE NULL
		END,
		CASE
			WHEN item_id IS NOT NULL THEN
				itemuomtouomratio(item_id,
					COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.qty_uom),item_price_uom_id),
					item_price_uom_id
				)
			ELSE 1
		END,
		CASE
			WHEN item_id IS NOT NULL THEN
				COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.price_uom),item_price_uom_id)
			ELSE NULL
		END,
		CASE
			WHEN item_id IS NOT NULL THEN
				itemuomtouomratio(item_id,
					COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.price_uom),item_price_uom_id),
					item_price_uom_id
				)
			ELSE 1
		END,
                getGlAccntId(pNew.alternate_rev_account)
	FROM invchead
		LEFT OUTER JOIN item ON (item_id=getItemId(pNew.item_number))
		LEFT OUTER JOIN taxtype ON (taxtype_id=CASE
			WHEN pNew.tax_type IS NULL THEN getItemTaxType(item_id,invchead_taxzone_id)
			WHEN pNew.tax_type = 'None' THEN NULL
			ELSE (SELECT taxtype_id FROM taxtype WHERE taxtype_name=pNew.tax_type)
		END)
	WHERE (invchead_invcnumber=pNew.invoice_number) AND (invchead_posted=FALSE);
	RETURN TRUE;
END;
$insertInvoiceLineItem$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION updateInvoiceLineItem(api.invoiceline, api.invoiceline) RETURNS BOOLEAN AS
$updateInvoiceLineItem$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
	pNew ALIAS FOR $1;
	pOld ALIAS FOR $2;
	_r RECORD;
BEGIN
	UPDATE invcitem SET
		invcitem_linenumber=pNew.line_number,
		invcitem_item_id=COALESCE(item_id, -1),
		invcitem_custpn=pNew.customer_part_number,
		invcitem_number=(CASE WHEN item_id IS NULL THEN pNew.misc_item_number ELSE NULL END),
		invcitem_warehous_id=(CASE WHEN invcitem_warehous_id IS NULL THEN COALESCE(getwarehousid(pNew.site,'ALL'),-1) ELSE NULL END),
		invcitem_descrip=(CASE WHEN item_id IS NULL THEN pNew.misc_item_description ELSE NULL END),
		invcitem_ordered=pNew.qty_ordered,
		invcitem_billed=COALESCE(pNew.qty_billed, 0),
                invcitem_updateinv=COALESCE(pNew.update_inventory,FALSE),
		invcitem_price=COALESCE(pNew.net_unit_price,itemPrice(item_id,invchead_cust_id,
			invchead_shipto_id,pNew.qty_ordered,invchead_curr_id,invchead_orderdate)),
		invcitem_notes=COALESCE(pNew.notes,''),
		invcitem_salescat_id=CASE
			WHEN item_id IS NULL THEN
				(SELECT salescat_id FROM salescat WHERE salescat_name = pNew.sales_category)
			ELSE NULL
		END,
		invcitem_taxtype_id=taxtype_id,
		invcitem_qty_uom_id=CASE
			WHEN item_id IS NOT NULL THEN
				COALESCE((SELECT uom_id FROM uom WHERE (uom_name=pNew.qty_uom)), item_price_uom_id)
			ELSE NULL
		END,
		invcitem_qty_invuomratio=CASE
			WHEN item_id IS NOT NULL THEN
				itemuomtouomratio(item_id,
					COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.qty_uom),item_price_uom_id),
					item_price_uom_id
				)
			ELSE 1
		END,
		invcitem_price_uom_id=CASE
			WHEN item_id IS NOT NULL THEN
				COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.price_uom),item_price_uom_id)
			ELSE NULL
		END,
		invcitem_price_invuomratio=CASE
			WHEN item_id IS NOT NULL THEN
				itemuomtouomratio(item_id,
					COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.price_uom),item_price_uom_id),
					item_price_uom_id
				)
			ELSE 1
		END,
                invcitem_rev_accnt_id=getGlAccntId(alternate_rev_account)
	FROM invchead
		LEFT OUTER JOIN item ON (item_id=getItemId(pNew.item_number))
		LEFT OUTER JOIN taxtype ON (taxtype_id=CASE
			WHEN pNew.tax_type IS NULL THEN getItemTaxType(item_id,invchead_taxzone_id)
			WHEN pNew.tax_type = 'None' THEN NULL
			ELSE (SELECT taxtype_id FROM taxtype WHERE taxtype_name=pNew.tax_type)
		END)
	WHERE invcitem_invchead_id=invchead_id
		AND invcitem_linenumber=pOld.line_number
		AND invchead_invcnumber=pOld.invoice_number
		AND invchead_posted=FALSE;
	RETURN TRUE;
END;
$updateInvoiceLineItem$ LANGUAGE 'plpgsql';


--Rules

CREATE OR REPLACE RULE "_INSERT" AS
	ON INSERT TO api.invoiceline DO INSTEAD
		SELECT insertInvoiceLineItem(NEW);


CREATE OR REPLACE RULE "_UPDATE" AS 
	ON UPDATE TO api.invoiceline DO INSTEAD
		SELECT updateInvoiceLineItem(NEW, OLD);


CREATE OR REPLACE RULE "_DELETE" AS 
	ON DELETE TO api.invoiceline DO INSTEAD
	
	DELETE FROM invcitem
	WHERE invcitem_invchead_id=(
		SELECT invchead_id FROM invchead
		WHERE invchead_invcnumber=OLD.invoice_number
			AND invchead_posted = FALSE
	);
