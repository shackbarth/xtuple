
SELECT dropifexists('view','cosmisc');
CREATE OR REPLACE VIEW cosmisc AS
  SELECT shiphead_id		AS cosmisc_id,
	 shiphead_order_id	AS cosmisc_cohead_id,
	 shiphead_shipvia	AS cosmisc_shipvia,
	 shiphead_freight	AS cosmisc_freight,
	 shiphead_notes		AS cosmisc_notes,
	 shiphead_shipdate	AS cosmisc_shipdate,
	 shiphead_shipchrg_id	AS cosmisc_shipchrg_id,
	 shiphead_shipform_id	AS cosmisc_shipform_id,
	 shiphead_shipped	AS cosmisc_shipped,
	 shiphead_sfstatus	AS cosmisc_sfstatus,
	 shiphead_tracknum	AS cosmisc_tracknum,
	 shiphead_number	AS cosmisc_number
  FROM shiphead
  WHERE (shiphead_order_type='SO');

REVOKE ALL ON TABLE cosmisc FROM PUBLIC;
GRANT  ALL ON TABLE cosmisc TO GROUP xtrole;

