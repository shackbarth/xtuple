SELECT dropIfExists('view', 'sopack');

CREATE VIEW sopack AS
  SELECT pack_id AS sopack_id,
	 pack_head_id AS sopack_sohead_id,
	 pack_printed AS sopack_printed,
	 pack_shiphead_id AS sopack_cosmisc_id
  FROM pack
  WHERE (pack_head_type='SO');
REVOKE ALL ON TABLE sopack FROM PUBLIC;
GRANT  ALL ON TABLE sopack TO GROUP xtrole;
