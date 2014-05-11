-- join with the checkhead table to get information about the check recipient
SELECT dropIfExists('view', 'checkrecip');

CREATE VIEW checkrecip (
  checkrecip_id,
  checkrecip_type,
  checkrecip_number,
  checkrecip_name,
  checkrecip_gltrans_source,
  checkrecip_accnt_id,	-- primary g/l account for this check recipient
  checkrecip_addr_id	-- address to which to write the check
  )
AS
SELECT cust_id, 'C', cust_number, cust_name, 'A/R', findARAccount(cust_id),
       cntct_addr_id
FROM custinfo LEFT OUTER JOIN cntct ON (cust_cntct_id=cntct_id)
UNION ALL
SELECT taxauth_id, 'T', taxauth_code, taxauth_name, 'G/L', taxauth_accnt_id,
       taxauth_addr_id
FROM taxauth
UNION ALL
SELECT vend_id, 'V', vend_number, vend_name, 'A/P', findAPAccount(vend_id),
       vendaddr_addr_id
FROM vendinfo LEFT OUTER JOIN vendaddrinfo ON ((vend_id=vendaddr_vend_id)
					  AND (UPPER(vendaddr_code)='REMIT'));

REVOKE ALL ON TABLE checkrecip FROM PUBLIC;
GRANT  ALL ON TABLE checkrecip TO GROUP xtrole;
