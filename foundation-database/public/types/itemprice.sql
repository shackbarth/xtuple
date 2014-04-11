
DROP VIEW IF EXISTS api.quoteline;
DROP FUNCTION IF EXISTS itemPrice(pItemid INTEGER,
                                     pCustid INTEGER,
                                     pShiptoid INTEGER,
                                     pQty NUMERIC,
                                     pCurrid INTEGER,
                                     pEffective DATE);
DROP FUNCTION IF EXISTS itemPrice(pItemid INTEGER,
                                     pCustid INTEGER,
                                     pShiptoid INTEGER,
                                     pQty NUMERIC,
                                     pQtyUOM INTEGER,
                                     pPriceUOM INTEGER,
                                     pCurrid INTEGER,
                                     pEffective DATE);
DROP FUNCTION IF EXISTS itemPrice(pItemid INTEGER,
                                     pCustid INTEGER,
                                     pShiptoid INTEGER,
                                     pQty NUMERIC,
                                     pQtyUOM INTEGER,
                                     pPriceUOM INTEGER,
                                     pCurrid INTEGER,
                                     pEffective DATE,
                                     pAsOf DATE);
DROP FUNCTION IF EXISTS itemPrice(pItemid INTEGER,
                                     pCustid INTEGER,
                                     pShiptoid INTEGER,
                                     pQty NUMERIC,
                                     pQtyUOM INTEGER,
                                     pPriceUOM INTEGER,
                                     pCurrid INTEGER,
                                     pEffective DATE,
                                     pAsOf DATE,
                                     pSiteid INTEGER);

DROP FUNCTION IF EXISTS itemIpsPrice(pItemid INTEGER,
                                        pCustid INTEGER,
                                        pShiptoid INTEGER,
                                        pQty NUMERIC,
                                        pQtyUOM INTEGER,
                                        pPriceUOM INTEGER,
                                        pCurrid INTEGER,
                                        pEffective DATE,
                                        pAsOf DATE,
                                        pSiteid INTEGER);

DROP TYPE IF EXISTS itemprice;
CREATE TYPE itemprice AS (itemprice_price     NUMERIC,
                          itemprice_type      CHAR(1)
                       );
