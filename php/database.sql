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
    cuisine VARCHAR(50),
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Favorite recipes table
CREATE TABLE IF NOT EXISTS favorite_recipes (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
    UNIQUE KEY unique_favorite (user_id, recipe_id)
);

-- Recently viewed recipes table
CREATE TABLE IF NOT EXISTS recently_viewed_recipes (
    view_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
    UNIQUE KEY unique_view (user_id, recipe_id)
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
INSERT INTO recipes (user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, image_url) VALUES
(1, 'Spaghetti Carbonara', 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.', '400g spaghetti\n200g pancetta or guanciale, diced\n4 large eggs\n100g Pecorino Romano cheese, grated\n50g Parmesan cheese, grated\nFreshly ground black pepper\nSalt to taste', '1. Cook the spaghetti in salted water according to package instructions until al dente.\n2. While the pasta is cooking, fry the pancetta in a large pan until crispy.\n3. In a bowl, whisk together the eggs, grated cheeses, and black pepper.\n4. Drain the pasta, reserving a little cooking water.\n5. Working quickly, add the hot pasta to the pancetta, then remove from heat.\n6. Add the egg and cheese mixture, stirring quickly to create a creamy sauce.\n7. If needed, add a splash of the reserved pasta water to create a creamy sauce.\n8. Serve immediately with additional grated cheese and black pepper on top.', 15, 15, 5, 'https://www.allrecipes.com/thmb/Vg2cRidr2zcYhWGvPD8M18xM_WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg'),
(2, 2, 'Chicken Tikka Masala', 'Grilled chunks of chicken enveloped in a creamy spiced tomato sauce.', '800g boneless chicken thighs, cut into bite-sized pieces\n2 cups plain yogurt\n3 tbsp lemon juice\n4 tsp ground cumin\n4 tsp ground coriander\n2 tsp ground turmeric\n2 tsp garam masala\n2 tsp salt\n2 tbsp vegetable oil\n1 large onion, finely chopped\n4 garlic cloves, minced\n2 tbsp grated fresh ginger\n2 tsp ground paprika\n1 can (400g) tomato sauce\n1 cup heavy cream\nFresh cilantro for garnish', '1. In a large bowl, combine yogurt, lemon juice, cumin, coriander, turmeric, garam masala, and salt.\n2. Add chicken pieces and stir to coat. Marinate for at least 1 hour, preferably overnight.\n3. Preheat grill or broiler. Thread chicken onto skewers and grill until charred and cooked through.\n4. Heat oil in a large pan over medium heat. Add onion and cook until softened.\n5. Add garlic and ginger, cook for 1 minute. Add paprika and cook for another minute.\n6. Add tomato sauce and simmer for 15 minutes.\n7. Add grilled chicken and simmer for 10 minutes.\n8. Stir in cream and simmer until heated through.\n9. Garnish with fresh cilantro and serve with rice or naan.', 30, 45, 6, 'https://realfood.tesco.com/media/images/1400x919-Chicken-tikka-masala-43fcdbd8-eb86-4b55-951d-adda29067afa-0-1400x919.jpg', '2025-04-09 18:01:35', 'indian', 'medium', 0),
(4, 5, 'Beef Stroganoff', 'Tender strips of beef in a rich, creamy mushroom sauce served over noodles.', '700g beef sirloin, thinly sliced\n2 tbsp vegetable oil\n2 tbsp butter\n1 large onion, finely chopped\n400g mushrooms, sliced\n3 cloves garlic, minced\n2 tbsp all-purpose flour\n2 cups beef broth\n1 tbsp Dijon mustard\n1 tbsp Worcestershire sauce\n1 cup sour cream\nSalt and pepper to taste\n500g egg noodles, cooked\nChopped fresh parsley for garnish', '1. Season beef with salt and pepper.\n2. Heat oil in a large skillet over high heat. Add beef in batches and cook until browned, about 1 minute per side. Remove and set aside.\n3. In the same pan, melt butter. Add onions and cook until softened, about 3 minutes.\n4. Add mushrooms and garlic, cook until mushrooms are golden, about 5 minutes.\n5. Sprinkle flour over the mixture and stir for 1 minute.\n6. Gradually add beef broth, stirring constantly. Bring to a simmer.\n7. Stir in mustard and Worcestershire sauce. Simmer for 5 minutes until thickened.\n8. Reduce heat to low, stir in sour cream until combined.\n9. Return beef to the pan and heat through, about 2 minutes.\n10. Serve over cooked egg noodles and garnish with parsley.', 20, 25, 6, 'https://www.allrecipes.com/thmb/txgejbRaNYg1Pbzw87YKZsTAXYI=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/16311-simple-beef-stroganoff-DDMFS-4x3-1e966286eef54c0f96c882e569926eb3.jpg', '2025-04-09 18:11:59', 'italian', 'medium', 0),
(5, 4, 'Homemade Pizza', 'Classic homemade pizza with a crispy crust, tangy tomato sauce, and melty cheese.', 'For the dough:\n3 1/2 cups all-purpose flour\n1 tsp sugar\n1 envelope instant dry yeast\n2 tsp salt\n1 1/2 cups warm water\n2 tbsp olive oil, plus more for brushing\nFor the sauce:\n1 can (28oz) crushed tomatoes\n2 tbsp olive oil\n2 cloves garlic, minced\n1 tsp dried oregano\n1 tsp dried basil\nSalt and pepper to taste\nFor the toppings:\n2 cups shredded mozzarella cheese\n1/2 cup grated Parmesan cheese\nToppings of your choice (pepperoni, mushrooms, bell peppers, etc.)', 'For the dough:\n1. In a large bowl, combine flour, sugar, yeast, and salt.\n2. Add warm water and olive oil, stir until a dough forms.\n3. Knead on a floured surface for 5-7 minutes until smooth and elastic.\n4. Place in an oiled bowl, cover, and let rise for 1 hour or until doubled in size.\nFor the sauce:\n1. In a saucepan, heat olive oil over medium heat.\n2. Add garlic and cook for 30 seconds until fragrant.\n3. Add crushed tomatoes, oregano, basil, salt, and pepper.\n4. Simmer for 15-20 minutes until thickened.\nAssembly:\n1. Preheat oven to 475°F (245°C) with a pizza stone if available.\n2. Divide dough in half. Roll each half into a 12-inch circle.\n3. Place on a cornmeal-dusted pizza peel or baking sheet.\n4. Spread sauce over dough, leaving a 1-inch border.\n5. Sprinkle with cheeses and add desired toppings.\n6. Bake for 12-15 minutes until crust is golden and cheese is bubbly.\n7. Let cool slightly before slicing.', 30, 15, 4, 'https://septemberfarmcheese.b-cdn.net/wp-content/uploads/Blogs/Homemade-Pizza/homemade-pizza-monterey-jack-cheese.jpg', '2025-04-09 18:11:59', 'italian', 'hard', 0),
(6, 6, 'Chocolate Chip Cookies', 'Classic homemade cookies with chocolate chips and a soft, chewy center.', '2 1/4 cups all-purpose flour\n1 tsp baking soda\n1 tsp salt\n1 cup unsalted butter, softened\n3/4 cup granulated sugar\n3/4 cup packed brown sugar\n2 large eggs\n2 tsp vanilla extract\n2 cups semi-sweet chocolate chips\n1 cup chopped nuts (optional)', '1. Preheat oven to 375°F (190°C).\n2. In a small bowl, combine flour, baking soda, and salt.\n3. In a large bowl, cream together butter, granulated sugar, and brown sugar until smooth.\n4. Beat in eggs one at a time, then stir in vanilla.\n5. Gradually blend in the dry ingredients.\n6. Stir in chocolate chips and nuts if using.\n7. Drop by rounded tablespoons onto ungreased baking sheets.\n8. Bake for 9 to 11 minutes or until golden brown.\n9. Let stand on baking sheet for 2 minutes, then remove to cool on wire racks.', 20, 10, 24, 'https://cdn.loveandlemons.com/wp-content/uploads/2024/08/chocolate-chip-cookie-recipe.jpg', '2025-04-09 18:11:59', 'american', 'medium', 0),
(7, 2, 'Beef Tacos', 'Seasoned ground beef in crispy taco shells with fresh toppings.', '1 lb ground beef\n1 onion, finely chopped\n2 cloves garlic, minced\n2 tbsp taco seasoning\n1/2 cup water\n12 taco shells\n2 cups shredded lettuce\n2 tomatoes, diced\n1 cup shredded cheddar cheese\n1/2 cup sour cream\n1/4 cup chopped fresh cilantro\nHot sauce to taste', '1. In a large skillet over medium-high heat, cook ground beef and onion until beef is browned.\n2. Add garlic and cook for 1 minute.\n3. Stir in taco seasoning and water. Bring to a simmer and cook until thickened, about 5 minutes.\n4. Meanwhile, heat taco shells according to package directions.\n5. Fill shells with beef mixture.\n6. Top with lettuce, tomatoes, cheese, sour cream, and cilantro.\n7. Serve with hot sauce on the side.', 15, 15, 4, 'https://oliviaadriance.com/wp-content/uploads/2023/07/Final_3_Crispy_Baked_Beef_Tacos_grain-free-dairy-free.jpg', '2025-04-09 18:11:59', 'mexican', 'medium', 0),
(9, 5, 'French Onion Soup', 'Rich beef broth with caramelized onions, topped with crusty bread and melted cheese.', '4 large onions, thinly sliced\n3 tbsp butter\n1 tbsp olive oil\n1 tsp sugar\n2 cloves garlic, minced\n1/4 cup dry white wine\n6 cups beef broth\n1 bay leaf\n2 sprigs fresh thyme\nSalt and pepper to taste\n8 slices French bread, toasted\n2 cups grated Gruyère cheese', '1. In a large pot, melt butter with olive oil over medium heat.\n2. Add onions and sugar, cook for 30-40 minutes, stirring occasionally, until deeply caramelized.\n3. Add garlic and cook for 1 minute.\n4. Pour in wine and scrape up any browned bits from the bottom of the pot.\n5. Add beef broth, bay leaf, and thyme. Bring to a simmer.\n6. Cover and simmer for 30 minutes. Season with salt and pepper.\n7. Preheat broiler. Ladle soup into oven-safe bowls.\n8. Place a slice of toasted bread on top of each bowl of soup.\n9. Sprinkle generously with Gruyère cheese.\n10. Broil until cheese is melted and bubbly, about 2-3 minutes.\n11. Serve immediately.', 15, 75, 4, 'https://www.kitchensanctuary.com/wp-content/uploads/2023/11/French-Onion-Soup-square-FS.jpg', '2025-04-09 18:11:59', 'chinese', 'medium', 0),
(16, 2, 'Avocado Toast', 'Simple and delicious breakfast', 'Bread, Avocado, Salt, Pepper, Red Pepper Flakes', '1. Toast bread\n2. Mash avocado\n3. Spread on toast\n4. Season', 5, 2, 1, 'https://www.allrecipes.com/thmb/Vg2cRidr2zcYhWGvPD8M18xM_WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg', '2025-04-13 13:38:16', NULL, NULL, 1);

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

INSERT INTO favorite_recipes (favorite_id, user_id, recipe_id, created_at) VALUES
(36, 2, 4, '2025-04-15 07:53:37'),
(39, 2, 16, '2025-04-15 07:55:26'),
(51, 3, 4, '2025-04-15 08:22:48'),
(60, 3, 2, '2025-04-15 08:40:51');