-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role ENUM('user', 'admin') NOT NULL
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    prep_time INT,
    cook_time INT,
    servings INT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS competitions (
    competition_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    status ENUM('upcoming', 'past', 'active', 'deleted') NOT NULL,
    end_date DATE NOT NULL,
    prize INT,
    voting_end_date DATE NOT NULL,
    winner_entry_id INT
);

CREATE TABLE IF NOT EXISTS competition_entries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    competition_id INT NOT NULL,
    recipe_id INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    delete_description VARCHAR(255),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (competition_id) REFERENCES competitions(competition_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
    UNIQUE KEY unique_entry (competition_id, recipe_id)
);

ALTER TABLE competitions
ADD CONSTRAINT fk_winner_entry
FOREIGN KEY (winner_entry_id)
REFERENCES competition_entries(entry_id);

CREATE TABLE IF NOT EXISTS votes (
    vote_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_id INT NOT NULL,
    vote_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    voted TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (entry_id) REFERENCES competition_entries(entry_id),
    UNIQUE KEY unique_vote (entry_id, user_id)
);

-- Insert sample users
INSERT INTO users (username, email, password, role) VALUES
('admin123', 'admin@example.com', '$2a$12$hPUix6kRKoUIIh1PQJckEOc3lKr6o43cU1xkITUfRYTnu1dbVMaSq', 'admin'), -- hashed 'password'
('john_doe', 'john@example.com', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOSsqcpZj1BCqZ5BhXCBIWiT3nKSm', 'user'), -- hashed 'password123'
('jane_smith', 'jane@example.com', '$2a$10$bNdPVIF0tKHK9aaH89Tw8eMteJqNZOPPPa.WcD8tJVxS7Yy3ASuai', 'user'), -- hashed 'securepwd456'
('chef_mike', 'mike@cooking.com', '$2a$10$QlOu1QqHNKTZ0LKQSuU9h.4vNiPA52Z4cOZhpKHRDJPIqn4oXRW7.', 'user'), -- hashed 'cookmaster789'
('foodie_lisa', 'lisa@foodblog.com', '$2a$10$9jGzd/XvQzoYdWtEYIMXnewF3EGAh3TEgU0GTvxWVqkNO1fFGPHNi', 'user'), -- hashed 'tasty2023'
('gordon_r', 'gordon@cuisine.net', '$2a$10$2nbSHOpVJEPUMV0VXQmQxeg0KbzS9QMjYlWVPY.AVEqFQn0yimcOq', 'user'); -- hashed 'cheflife555'

-- Insert sample recipes
INSERT INTO recipes (user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, image_url) VALUES
(1, 'Classic Spaghetti Carbonara', 'A traditional Italian pasta dish from Rome', 
'Spaghetti, Eggs, Pecorino Romano, Guanciale, Black Pepper', 
'1. Cook pasta\n2. Fry guanciale\n3. Mix eggs and cheese\n4. Combine all ingredients', 
15, 10, 4, 'https://example.com/images/carbonara.jpg'),

(2, 'Avocado Toast', 'Simple and delicious breakfast', 
'Bread, Avocado, Salt, Pepper, Red Pepper Flakes', 
'1. Toast bread\n2. Mash avocado\n3. Spread on toast\n4. Season', 
5, 2, 1, 'https://example.com/images/avocado_toast.jpg'),

(3, 'Beef Wellington', 'Impressive centerpiece for special occasions', 
'Beef Tenderloin, Mushrooms, Puff Pastry, Prosciutto, Dijon Mustard', 
'1. Sear beef\n2. Prepare mushroom duxelles\n3. Wrap in prosciutto\n4. Wrap in pastry\n5. Bake', 
45, 35, 6, 'https://example.com/images/beef_wellington.jpg'),

(4, 'Thai Green Curry', 'Fragrant and spicy Thai favorite', 
'Chicken, Green Curry Paste, Coconut Milk, Bamboo Shoots, Thai Basil', 
'1. Fry curry paste\n2. Add coconut milk\n3. Cook chicken\n4. Add vegetables\n5. Garnish with basil', 
20, 25, 4, 'https://example.com/images/thai_curry.jpg'),

(5, 'Chocolate Soufflé', 'Impressive and delicious dessert', 
'Dark Chocolate, Eggs, Butter, Sugar, Flour', 
'1. Melt chocolate with butter\n2. Separate eggs\n3. Whip whites\n4. Fold together\n5. Bake until risen', 
30, 15, 2, 'https://example.com/images/souffle.jpg'),

(1, 'BBQ Pulled Pork', 'Slow-cooked Southern classic', 
'Pork Shoulder, BBQ Rub, Apple Cider Vinegar, BBQ Sauce', 
'1. Rub pork with spices\n2. Slow cook for 8 hours\n3. Shred\n4. Mix with sauce', 
30, 480, 8, 'https://example.com/images/pulled_pork.jpg'),

(2, 'Vegetable Lasagna', 'Hearty vegetarian pasta dish', 
'Lasagna Noodles, Ricotta, Zucchini, Spinach, Tomato Sauce, Mozzarella', 
'1. Sauté vegetables\n2. Layer ingredients\n3. Bake until bubbly', 
40, 50, 8, 'https://example.com/images/veg_lasagna.jpg');

-- Insert sample competitions
INSERT INTO competitions (title, description, start_date, end_date, voting_end_date, status, prize) VALUES
('Summer BBQ Showdown', 'Show us your best barbecue recipes!', '2024-06-01', '2024-06-15', '2024-06-22', 'upcoming', 500),
('Comfort Food Classics', 'Share your favorite comfort food recipes', '2024-03-10', '2024-04-15', '2024-04-15', 'active', 300),
('Holiday Cookie Contest', 'Your best holiday cookie recipes', '2024-12-01', '2024-12-15', '2024-12-22', 'upcoming', 400),
('Vegan Challenge', 'Create amazing plant-based dishes', '2024-04-01', '2024-04-14', '2024-04-21', 'active', 350);

-- Insert sample competition entries
INSERT INTO competition_entries (competition_id, recipe_id, submission_date) VALUES
(2, 1, '2024-03-15 14:30:00'), -- Carbonara in Comfort Food contest
(2, 3, '2024-03-16 09:45:00'), -- Beef Wellington in Comfort Food contest
(2, 5, '2024-03-17 16:20:00'), -- Chocolate Soufflé in Comfort Food contest
(4, 2, '2024-04-02 10:15:00'), -- Avocado Toast in Vegan Challenge
(4, 7, '2024-04-03 11:30:00'); -- Vegetable Lasagna in Vegan Challenge


-- Insert sample votes
INSERT INTO votes (user_id, entry_id, vote_date, voted) VALUES
(1, 2, '2024-03-18 14:20:00', 1),
(2, 3, '2024-03-19 09:45:00', 1),
(3, 1, '2024-03-18 16:30:00', 1),
(4, 3, '2024-03-19 12:15:00', 1),
(5, 3, '2024-03-20 10:30:00', 1),
(1, 4, '2024-04-05 14:20:00', 1),
(2, 5, '2024-04-06 09:45:00', 1),
(3, 4, '2024-04-07 16:30:00', 1);