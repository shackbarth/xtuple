-- Add columns for data needed for external pre-auths that will have no ccpay_ccard_id.
select xt.add_column('ccpay','ccpay_card_pan_trunc', 'text', null, 'public', 'External Pre-Auth truncated PAN. Last four digits of the card.');
-- TODO: PayPal
--select xt.add_column('ccpay','ccpay_card_type', 'text', null, 'public', 'External Pre-Auth card type: V=Visa, M=MasterCard, A=American Express, D=Discover, P=Paypal.');
select xt.add_column('ccpay','ccpay_card_type', 'text', null, 'public', 'External Pre-Auth card type: V=Visa, M=MasterCard, A=American Express, D=Discover.');
