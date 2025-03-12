-- Create the category table if it doesn't exist
CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    category_name TEXT UNIQUE NOT NULL
);
 
-- Create the games table if it doesn't exist
CREATE TABLE IF NOT EXISTS cars (
    car_id SERIAL PRIMARY KEY,
    car_name TEXT NOT NULL,
    car_description TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    image_path TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);
 
-- Insert initial categories
INSERT INTO category (category_id, category_name) VALUES
(1, 'Strategy'),
(2, 'Party')
ON CONFLICT (category_id) DO NOTHING;

-- You may need to reset the sequence after direct ID insertions
SELECT setval('category_category_id_seq', (SELECT MAX(category_id) FROM category));
 
-- Insert initial games
INSERT INTO cars (car_id, car_name, car_description, category_id, image_path) VALUES
(1, 'Catan', 'A popular resource-trading and city-building game.', 1, '/images/cars/catan.jpg'),
(2, 'Risk', 'A world domination game of strategy and conquest.', 1, '/images/cars/risk.jpg'),
(3, 'Uno', 'A fast-paced card game of matching colors and numbers.', 2, '/cars/games/uno.jpg'),
(4, 'Apples to Apples', 'A fun word association game perfect for family and friends.', 2, '/images/cars/apples-to-apples.jpg')
ON CONFLICT (game_id) DO NOTHING;

-- Reset the games sequence
SELECT setval('cars_car_id_seq', (SELECT MAX(car_id) FROM cars));

-- Create the users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Create the contact table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact (
    contact_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL
);