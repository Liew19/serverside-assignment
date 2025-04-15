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
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (entry_id) REFERENCES competition_entries(entry_id),
    UNIQUE KEY unique_vote (entry_id, user_id)
);

-- Insert sample users
INSERT INTO users (username, email, password, role) VALUES
('admin123', 'admin@example.com', '$2a$12$hPUix6kRKoUIIh1PQJckEOc3lKr6o43cU1xkITUfRYTnu1dbVMaSq', 'admin'), -- hashed 'password'
('john_doe', 'john@example.com', '$2a$12$iYSGSa4o2fIVS0BGS68vbumGao6ojenrVEIEzb190Wfh.nnOL3wgy', 'user'), -- hashed 'password123'
('jane_smith', 'jane@example.com', '$2a$12$C3xEt0PY0gbdNpt19b.40uLzmzNHPvHyAyGzKI0mHZWheeeYeq02u', 'user'), -- hashed 'securepwd456'
('chef_mike', 'mike@cooking.com', '$2a$12$ZPXdu1bgmCe9obLvEioHdOPGAU.iaBhyxOpsusJ6FEGwm0Eax.u4G', 'user'), -- hashed 'cookmaster789'
('foodie_lisa', 'lisa@foodblog.com', '$2a$12$lqJqJhEohau9LGoPKZhLOuzVhcBv7/Ltum6t0rmFi5vANr.WE.yxi', 'user'), -- hashed 'tasty2023'
('gordon_r', 'gordon@cuisine.net', '$2a$12$nVOK3v6cA4WtQ9P8dEP93.tbeUOJHDiIVwCxmCFUcogOxPuM00jWW', 'user'); -- hashed 'cheflife555'

-- Insert sample recipes
INSERT INTO recipes (
  user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, image_url
) VALUES
(1, 'Spaghetti Carbonara', 'Classic creamy Italian pasta dish.', 'Spaghetti, Eggs, Parmesan, Bacon, Pepper', 'Cook pasta. Fry bacon. Mix eggs and cheese. Combine all.', 10, 15, 2, 'https://example.com/images/carbonara.jpg'),

(2, 'Chicken Tikka Masala', 'Flavorful Indian curry with grilled chicken.', 'Chicken, Yogurt, Tomato, Onion, Spices', 'Marinate chicken. Grill. Cook sauce. Combine.', 20, 30, 4, 'https://example.com/images/tikka.jpg'),

(3, 'Beef Tacos', 'Spicy Mexican beef tacos with toppings.', 'Beef, Taco shells, Lettuce, Cheese, Salsa', 'Cook beef. Prep toppings. Assemble tacos.', 15, 10, 3, 'https://example.com/images/tacos.jpg'),

(4, 'Veggie Stir Fry', 'Quick and healthy stir-fried vegetables.', 'Broccoli, Carrot, Bell pepper, Soy sauce, Garlic', 'Chop veggies. Stir fry with sauce.', 10, 10, 2, 'https://example.com/images/stirfry.jpg'),

(5, 'Salmon Teriyaki', 'Japanese-style salmon glazed with teriyaki sauce.', 'Salmon, Teriyaki sauce, Rice, Scallions', 'Sear salmon. Add sauce. Serve with rice.', 10, 15, 2, 'https://example.com/images/salmon.jpg'),

(6, 'Pancakes', 'Fluffy breakfast pancakes with syrup.', 'Flour, Eggs, Milk, Baking powder, Syrup', 'Mix batter. Cook on skillet. Serve with syrup.', 10, 10, 4, 'https://example.com/images/pancakes.jpg'),

(1, 'Margherita Pizza', 'Simple Italian pizza with tomato, mozzarella, and basil.', 'Pizza dough, Tomato sauce, Mozzarella, Basil, Olive oil', 'Spread sauce on dough. Add cheese and basil. Bake.', 20, 15, 2, 'https://example.com/images/pizza.jpg'),

(2, 'Butter Chicken', 'Creamy tomato-based Indian chicken dish.', 'Chicken, Butter, Tomato, Cream, Spices', 'Cook chicken. Prepare sauce. Simmer together.', 25, 30, 4, 'https://example.com/images/butterchicken.jpg'),

(3, 'Chili Con Carne', 'Hearty beef and bean chili.', 'Ground beef, Beans, Tomato, Onion, Chili powder', 'Brown beef. Add ingredients. Simmer until thick.', 15, 40, 6, 'https://example.com/images/chili.jpg'),

(4, 'Pad Thai', 'Classic Thai noodle stir-fry with tamarind and peanuts.', 'Rice noodles, Egg, Tofu, Tamarind paste, Peanuts', 'Soak noodles. Stir fry all ingredients with sauce.', 15, 10, 2, 'https://example.com/images/padthai.jpg'),

(5, 'Shrimp Scampi', 'Garlicky shrimp pasta with lemon and butter.', 'Shrimp, Garlic, Butter, Lemon, Spaghetti', 'Cook pasta. Sauté shrimp with garlic and butter. Combine.', 10, 10, 2, 'https://example.com/images/scampi.jpg'),

(6, 'French Toast', 'Golden slices of bread soaked in egg and fried.', 'Bread, Eggs, Milk, Cinnamon, Syrup', 'Dip bread in egg mix. Fry both sides. Serve warm.', 10, 10, 3, 'https://example.com/images/frenchtoast.jpg');

-- Insert sample competitions
INSERT INTO competitions (title, description, start_date, end_date, voting_end_date, status, prize) VALUES
('Summer BBQ Showdown', 'Show us your best barbecue recipes!', '2024-06-01', '2024-06-15', '2024-06-22', 'upcoming', 500),
('Comfort Food Classics', 'Share your favorite comfort food recipes', '2024-03-10', '2024-04-15', '2024-04-15', 'active', 300),
('Holiday Cookie Contest', 'Your best holiday cookie recipes', '2024-12-01', '2024-12-15', '2024-12-22', 'upcoming', 400),
('Vegan Challenge', 'Create amazing plant-based dishes', '2024-04-01', '2024-04-14', '2024-04-21', 'active', 350),
('Healthy Meal Masterpieces', 'Show us your healthiest meal creations!', '2025-04-15', '2025-04-30', '2025-05-05', 'active', 450),
('World Pizza Championship', 'Submit your best pizza recipes and compete for the crown!', '2025-05-01', '2025-05-10', '2025-05-15', 'active', 600),
('Spicy Food Battle', 'Heat up the competition with your spiciest dishes!', '2025-05-20', '2025-06-05', '2025-06-10', 'active', 350),
('Gourmet Desserts', 'Delight us with your top-tier dessert recipes!', '2025-06-01', '2025-06-15', '2025-06-22', 'active', 500),
('Baking Extravaganza', 'Bake the most delicious cake or pastry and win!', '2025-07-01', '2025-07-10', '2025-07-15', 'active', 400),
('Street Food Fiesta', 'Bring your best street food recipes to the table!', '2025-07-05', '2025-07-20', '2025-07-25', 'active', 450),
('Quick & Easy Meals', 'Fast recipes for busy weekdays!', '2025-04-10', '2025-04-20', '2025-04-25', 'active', 300),
('Christmas Feast Cook-off', 'Share your best Christmas meal recipes!', '2025-12-01', '2025-12-15', '2025-12-20', 'upcoming', 400),
('Summer Smoothie Challenge', 'Create the best smoothie recipe for the summer!', '2025-06-01', '2025-06-10', '2025-06-15', 'upcoming', 250),
('Winter Soup Showcase', 'Warm us up with your best winter soups and stews!', '2025-11-01', '2025-11-10', '2025-11-15', 'upcoming', 300);

-- Insert sample competition entries
INSERT INTO competition_entries (competition_id, recipe_id, submission_date) VALUES
(2, 1), -- Carbonara in Comfort Food contest
(2, 3), -- Beef Wellington in Comfort Food contest
(2, 5), -- Chocolate Soufflé in Comfort Food contest
(4, 2), -- Avocado Toast in Vegan Challenge
(4, 7); -- Vegetable Lasagna in Vegan Challenge


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