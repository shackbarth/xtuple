-- Issue #23459 adds ccpay_card_type. Populate it from historical ccard relations.
UPDATE ccpay SET ccpay_card_type = (SELECT ccard_type FROM ccard WHERE ccard_id = ccpay_ccard_id)
WHERE ccpay_ccard_id IS NOT NULL;
