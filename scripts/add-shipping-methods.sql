-- Add default shipping methods
INSERT INTO shipping_methods (id, name, code, description, price, estimatedDays, isActive, sortOrder, createdAt, updatedAt)
VALUES
  (UUID(), 'Standard Shipping', 'standard', 'Standard shipping (5-7 business days)', 500.00, 7, true, 1, NOW(), NOW()),
  (UUID(), 'Express Shipping', 'express', 'Express shipping (2-3 business days)', 1000.00, 3, true, 2, NOW(), NOW()),
  (UUID(), 'Same Day Delivery', 'same_day', 'Same day delivery (within city limits)', 1500.00, 1, true, 3, NOW(), NOW()); 