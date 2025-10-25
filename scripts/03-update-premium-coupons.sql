-- Marcar 3 cupons como premium (bloqueados para não cadastrados)
UPDATE coupons SET is_premium = 1 WHERE id IN (1, 5, 9);
