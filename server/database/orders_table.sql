-- Create orders table for storing user orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_size VARCHAR(100),
    product_image TEXT,
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    order_total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled', 'processing'
    rated BOOLEAN DEFAULT FALSE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    delivery_status VARCHAR(255),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP,
    estimated_delivery TIMESTAMP,
    shipping_address TEXT,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Insert sample data for testing (optional)
-- Replace 'your_user_id' with an actual user ID from your users table
INSERT INTO orders (
    user_id, 
    product_name, 
    product_size, 
    product_image, 
    quantity, 
    price, 
    order_total, 
    status, 
    rated, 
    delivery_status, 
    order_date, 
    delivery_date, 
    shipping_address, 
    tracking_number
) VALUES 
(
    1, -- Replace with actual user_id
    'Tennis Club Eau de Parfum',
    '10 oz — 50 ml',
    'https://via.placeholder.com/80x80/90EE90/FFFFFF?text=Tennis',
    1,
    150.00,
    152.00,
    'completed',
    FALSE,
    'Your order has been successfully delivered',
    '2025-12-10',
    '2025-12-15',
    '123 Main Street, Lagos, Nigeria',
    'TRK123456789'
),
(
    1, -- Replace with actual user_id
    'Chanel Chance Eau de Parfum',
    '1.0 oz — 100 ml',
    'https://via.placeholder.com/80x80/FFD700/FFFFFF?text=Chanel',
    1,
    71.20,
    73.20,
    'completed',
    TRUE,
    'Your order has been successfully delivered',
    '2025-12-05',
    '2025-12-12',
    '456 Park Avenue, Accra, Ghana',
    'TRK987654321'
),
(
    1, -- Replace with actual user_id
    'Dior Sauvage Eau de Toilette',
    '3.4 oz — 100 ml',
    'https://via.placeholder.com/80x80/4169E1/FFFFFF?text=Dior',
    2,
    95.00,
    192.00,
    'pending',
    FALSE,
    'Your order is being processed',
    '2025-12-16',
    NULL,
    '789 Victoria Island, Lagos, Nigeria',
    'TRK456789123'
);

-- Update function for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
