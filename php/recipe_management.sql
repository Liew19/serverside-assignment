-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 15, 2025 at 02:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `recipe_management`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `reorder_recipe_ids` ()   BEGIN
    SET @count = 0;
    UPDATE recipes SET recipe_id = @count:= @count + 1 ORDER BY recipe_id;
    -- Reset AUTO_INCREMENT
    SET @max_id = (SELECT COALESCE(MAX(recipe_id), 0) FROM recipes);
    SET @sql = CONCAT('ALTER TABLE recipes AUTO_INCREMENT = ', @max_id + 1);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `competitions`
--

CREATE TABLE `competitions` (
  `competition_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `status` enum('upcoming','past','active','deleted') NOT NULL,
  `end_date` date NOT NULL,
  `prize` int(11) DEFAULT NULL,
  `voting_end_date` date NOT NULL,
  `winner_entry_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `competitions`
--

INSERT INTO `competitions` (`competition_id`, `title`, `description`, `start_date`, `status`, `end_date`, `prize`, `voting_end_date`, `winner_entry_id`) VALUES
(1, 'Summer BBQ Showdown', 'Show us your best barbecue recipes!', '2024-06-01', 'upcoming', '2024-06-15', 500, '2024-06-22', NULL),
(2, 'Comfort Food Classics', 'Share your favorite comfort food recipes', '2024-03-10', 'past', '2025-04-15', 300, '2025-04-15', 7),
(3, 'Holiday Cookie Contest', 'Your best holiday cookie recipes', '2024-12-01', 'upcoming', '2024-12-15', 400, '2024-12-22', NULL),
(4, 'Vegan Challenge', 'Create amazing plant-based dishes', '2024-04-01', 'past', '2025-04-14', 350, '2025-04-14', 6),
(5, 'Try comp1', 'Trty', '2025-04-15', 'active', '2025-04-22', 100, '2025-04-22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `competition_entries`
--

CREATE TABLE `competition_entries` (
  `entry_id` int(11) NOT NULL,
  `competition_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `delete_description` varchar(255) DEFAULT NULL,
  `submission_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `competition_entries`
--

INSERT INTO `competition_entries` (`entry_id`, `competition_id`, `recipe_id`, `is_deleted`, `delete_description`, `submission_date`) VALUES
(1, 2, 1, 0, NULL, '2024-03-15 06:30:00'),
(2, 2, 4, 0, NULL, '2024-03-16 01:45:00'),
(3, 2, 5, 0, NULL, '2024-03-17 08:20:00'),
(4, 4, 2, 0, NULL, '2024-04-02 02:15:00'),
(5, 4, 7, 0, NULL, '2024-04-03 03:30:00'),
(6, 4, 16, 0, NULL, '2025-04-14 12:56:04'),
(7, 2, 7, 0, NULL, '2025-04-14 13:01:32'),
(8, 2, 2, 0, NULL, '2025-04-15 08:51:09'),
(9, 5, 1, 0, NULL, '2025-04-15 08:53:03');

-- --------------------------------------------------------

--
-- Table structure for table `favorite_recipes`
--

CREATE TABLE `favorite_recipes` (
  `favorite_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorite_recipes`
--

INSERT INTO `favorite_recipes` (`favorite_id`, `user_id`, `recipe_id`, `created_at`) VALUES
(36, 2, 4, '2025-04-15 07:53:37'),
(39, 2, 16, '2025-04-15 07:55:26'),
(51, 3, 4, '2025-04-15 08:22:48'),
(60, 3, 2, '2025-04-15 08:40:51');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `prep_time` int(11) DEFAULT NULL,
  `cook_time` int(11) DEFAULT NULL,
  `servings` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `cuisine` varchar(50) DEFAULT NULL,
  `difficulty` varchar(20) DEFAULT NULL,
  `favourite` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `user_id`, `title`, `description`, `ingredients`, `instructions`, `prep_time`, `cook_time`, `servings`, `image_url`, `created_at`, `cuisine`, `difficulty`, `favourite`) VALUES
(1, 2, 'Spaghetti Carbonara', 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.', '400g spaghetti\n200g pancetta or guanciale, diced\n4 large eggs\n100g Pecorino Romano cheese, grated\n50g Parmesan cheese, grated\nFreshly ground black pepper\nSalt to taste', '1. Cook the spaghetti in salted water according to package instructions until al dente.\n2. While the pasta is cooking, fry the pancetta in a large pan until crispy.\n3. In a bowl, whisk together the eggs, grated cheeses, and black pepper.\n4. Drain the pasta, reserving a little cooking water.\n5. Working quickly, add the hot pasta to the pancetta, then remove from heat.\n6. Add the egg and cheese mixture, stirring quickly to create a creamy sauce.\n7. If needed, add a splash of the reserved pasta water to create a creamy sauce.\n8. Serve immediately with additional grated cheese and black pepper on top.', 15, 15, 5, 'https://www.allrecipes.com/thmb/Vg2cRidr2zcYhWGvPD8M18xM_WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg', '2025-04-09 18:01:35', 'italian', 'easy', 0),
(2, 2, 'Chicken Tikka Masala', 'Grilled chunks of chicken enveloped in a creamy spiced tomato sauce.', '800g boneless chicken thighs, cut into bite-sized pieces\n2 cups plain yogurt\n3 tbsp lemon juice\n4 tsp ground cumin\n4 tsp ground coriander\n2 tsp ground turmeric\n2 tsp garam masala\n2 tsp salt\n2 tbsp vegetable oil\n1 large onion, finely chopped\n4 garlic cloves, minced\n2 tbsp grated fresh ginger\n2 tsp ground paprika\n1 can (400g) tomato sauce\n1 cup heavy cream\nFresh cilantro for garnish', '1. In a large bowl, combine yogurt, lemon juice, cumin, coriander, turmeric, garam masala, and salt.\n2. Add chicken pieces and stir to coat. Marinate for at least 1 hour, preferably overnight.\n3. Preheat grill or broiler. Thread chicken onto skewers and grill until charred and cooked through.\n4. Heat oil in a large pan over medium heat. Add onion and cook until softened.\n5. Add garlic and ginger, cook for 1 minute. Add paprika and cook for another minute.\n6. Add tomato sauce and simmer for 15 minutes.\n7. Add grilled chicken and simmer for 10 minutes.\n8. Stir in cream and simmer until heated through.\n9. Garnish with fresh cilantro and serve with rice or naan.', 30, 45, 6, 'https://realfood.tesco.com/media/images/1400x919-Chicken-tikka-masala-43fcdbd8-eb86-4b55-951d-adda29067afa-0-1400x919.jpg', '2025-04-09 18:01:35', 'indian', 'medium', 0),
(4, 5, 'Beef Stroganoff', 'Tender strips of beef in a rich, creamy mushroom sauce served over noodles.', '700g beef sirloin, thinly sliced\n2 tbsp vegetable oil\n2 tbsp butter\n1 large onion, finely chopped\n400g mushrooms, sliced\n3 cloves garlic, minced\n2 tbsp all-purpose flour\n2 cups beef broth\n1 tbsp Dijon mustard\n1 tbsp Worcestershire sauce\n1 cup sour cream\nSalt and pepper to taste\n500g egg noodles, cooked\nChopped fresh parsley for garnish', '1. Season beef with salt and pepper.\n2. Heat oil in a large skillet over high heat. Add beef in batches and cook until browned, about 1 minute per side. Remove and set aside.\n3. In the same pan, melt butter. Add onions and cook until softened, about 3 minutes.\n4. Add mushrooms and garlic, cook until mushrooms are golden, about 5 minutes.\n5. Sprinkle flour over the mixture and stir for 1 minute.\n6. Gradually add beef broth, stirring constantly. Bring to a simmer.\n7. Stir in mustard and Worcestershire sauce. Simmer for 5 minutes until thickened.\n8. Reduce heat to low, stir in sour cream until combined.\n9. Return beef to the pan and heat through, about 2 minutes.\n10. Serve over cooked egg noodles and garnish with parsley.', 20, 25, 6, 'https://www.allrecipes.com/thmb/txgejbRaNYg1Pbzw87YKZsTAXYI=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/16311-simple-beef-stroganoff-DDMFS-4x3-1e966286eef54c0f96c882e569926eb3.jpg', '2025-04-09 18:11:59', 'italian', 'medium', 0),
(5, 4, 'Homemade Pizza', 'Classic homemade pizza with a crispy crust, tangy tomato sauce, and melty cheese.', 'For the dough:\n3 1/2 cups all-purpose flour\n1 tsp sugar\n1 envelope instant dry yeast\n2 tsp salt\n1 1/2 cups warm water\n2 tbsp olive oil, plus more for brushing\nFor the sauce:\n1 can (28oz) crushed tomatoes\n2 tbsp olive oil\n2 cloves garlic, minced\n1 tsp dried oregano\n1 tsp dried basil\nSalt and pepper to taste\nFor the toppings:\n2 cups shredded mozzarella cheese\n1/2 cup grated Parmesan cheese\nToppings of your choice (pepperoni, mushrooms, bell peppers, etc.)', 'For the dough:\n1. In a large bowl, combine flour, sugar, yeast, and salt.\n2. Add warm water and olive oil, stir until a dough forms.\n3. Knead on a floured surface for 5-7 minutes until smooth and elastic.\n4. Place in an oiled bowl, cover, and let rise for 1 hour or until doubled in size.\nFor the sauce:\n1. In a saucepan, heat olive oil over medium heat.\n2. Add garlic and cook for 30 seconds until fragrant.\n3. Add crushed tomatoes, oregano, basil, salt, and pepper.\n4. Simmer for 15-20 minutes until thickened.\nAssembly:\n1. Preheat oven to 475°F (245°C) with a pizza stone if available.\n2. Divide dough in half. Roll each half into a 12-inch circle.\n3. Place on a cornmeal-dusted pizza peel or baking sheet.\n4. Spread sauce over dough, leaving a 1-inch border.\n5. Sprinkle with cheeses and add desired toppings.\n6. Bake for 12-15 minutes until crust is golden and cheese is bubbly.\n7. Let cool slightly before slicing.', 30, 15, 4, 'https://septemberfarmcheese.b-cdn.net/wp-content/uploads/Blogs/Homemade-Pizza/homemade-pizza-monterey-jack-cheese.jpg', '2025-04-09 18:11:59', 'italian', 'hard', 0),
(6, 6, 'Chocolate Chip Cookies', 'Classic homemade cookies with chocolate chips and a soft, chewy center.', '2 1/4 cups all-purpose flour\n1 tsp baking soda\n1 tsp salt\n1 cup unsalted butter, softened\n3/4 cup granulated sugar\n3/4 cup packed brown sugar\n2 large eggs\n2 tsp vanilla extract\n2 cups semi-sweet chocolate chips\n1 cup chopped nuts (optional)', '1. Preheat oven to 375°F (190°C).\n2. In a small bowl, combine flour, baking soda, and salt.\n3. In a large bowl, cream together butter, granulated sugar, and brown sugar until smooth.\n4. Beat in eggs one at a time, then stir in vanilla.\n5. Gradually blend in the dry ingredients.\n6. Stir in chocolate chips and nuts if using.\n7. Drop by rounded tablespoons onto ungreased baking sheets.\n8. Bake for 9 to 11 minutes or until golden brown.\n9. Let stand on baking sheet for 2 minutes, then remove to cool on wire racks.', 20, 10, 24, 'https://cdn.loveandlemons.com/wp-content/uploads/2024/08/chocolate-chip-cookie-recipe.jpg', '2025-04-09 18:11:59', 'american', 'medium', 0),
(7, 2, 'Beef Tacos', 'Seasoned ground beef in crispy taco shells with fresh toppings.', '1 lb ground beef\n1 onion, finely chopped\n2 cloves garlic, minced\n2 tbsp taco seasoning\n1/2 cup water\n12 taco shells\n2 cups shredded lettuce\n2 tomatoes, diced\n1 cup shredded cheddar cheese\n1/2 cup sour cream\n1/4 cup chopped fresh cilantro\nHot sauce to taste', '1. In a large skillet over medium-high heat, cook ground beef and onion until beef is browned.\n2. Add garlic and cook for 1 minute.\n3. Stir in taco seasoning and water. Bring to a simmer and cook until thickened, about 5 minutes.\n4. Meanwhile, heat taco shells according to package directions.\n5. Fill shells with beef mixture.\n6. Top with lettuce, tomatoes, cheese, sour cream, and cilantro.\n7. Serve with hot sauce on the side.', 15, 15, 4, 'https://oliviaadriance.com/wp-content/uploads/2023/07/Final_3_Crispy_Baked_Beef_Tacos_grain-free-dairy-free.jpg', '2025-04-09 18:11:59', 'mexican', 'medium', 0),
(9, 5, 'French Onion Soup', 'Rich beef broth with caramelized onions, topped with crusty bread and melted cheese.', '4 large onions, thinly sliced\n3 tbsp butter\n1 tbsp olive oil\n1 tsp sugar\n2 cloves garlic, minced\n1/4 cup dry white wine\n6 cups beef broth\n1 bay leaf\n2 sprigs fresh thyme\nSalt and pepper to taste\n8 slices French bread, toasted\n2 cups grated Gruyère cheese', '1. In a large pot, melt butter with olive oil over medium heat.\n2. Add onions and sugar, cook for 30-40 minutes, stirring occasionally, until deeply caramelized.\n3. Add garlic and cook for 1 minute.\n4. Pour in wine and scrape up any browned bits from the bottom of the pot.\n5. Add beef broth, bay leaf, and thyme. Bring to a simmer.\n6. Cover and simmer for 30 minutes. Season with salt and pepper.\n7. Preheat broiler. Ladle soup into oven-safe bowls.\n8. Place a slice of toasted bread on top of each bowl of soup.\n9. Sprinkle generously with Gruyère cheese.\n10. Broil until cheese is melted and bubbly, about 2-3 minutes.\n11. Serve immediately.', 15, 75, 4, 'https://www.kitchensanctuary.com/wp-content/uploads/2023/11/French-Onion-Soup-square-FS.jpg', '2025-04-09 18:11:59', 'chinese', 'medium', 0),
(16, 2, 'Avocado Toast', 'Simple and delicious breakfast', 'Bread, Avocado, Salt, Pepper, Red Pepper Flakes', '1. Toast bread\n2. Mash avocado\n3. Spread on toast\n4. Season', 5, 2, 1, 'https://www.allrecipes.com/thmb/Vg2cRidr2zcYhWGvPD8M18xM_WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg', '2025-04-13 13:38:16', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `created_at`, `role`) VALUES
(2, 'admin123', 'admin@example.com', '$2a$12$MN6gB9WcZfZL/tNLK/u/COR3dm6pHHDnlnacjUrLkUDfjqCjr4KKC', '2025-04-13 13:38:16', 'admin'),
(3, 'john_doe', 'john@example.com', '$2a$12$I0xozaPCxrmXPK7lcg81Nu59rbOHJZU0fmhbcuUZ16JVVK.7cVWGq', '2025-04-13 13:38:16', 'user'),
(4, 'jane_smith', 'jane@example.com', '$2a$10$bNdPVIF0tKHK9aaH89Tw8eMteJqNZOPPPa.WcD8tJVxS7Yy3ASuai', '2025-04-13 13:38:16', 'user'),
(5, 'chef_mike', 'mike@cooking.com', '$2a$12$pmjjYPMSVjgxJH3/lCuOwOM2wzw8Lqa1sPvCT.HtV7c.y0okrOClW', '2025-04-13 13:38:16', 'user'),
(6, 'foodie_lisa', 'lisa@foodblog.com', '$2a$10$9jGzd/XvQzoYdWtEYIMXnewF3EGAh3TEgU0GTvxWVqkNO1fFGPHNi', '2025-04-13 13:38:16', 'user'),
(7, 'gordon_r', 'gordon@cuisine.net', '$2a$10$2nbSHOpVJEPUMV0VXQmQxeg0KbzS9QMjYlWVPY.AVEqFQn0yimcOq', '2025-04-13 13:38:16', 'user'),
(8, 'damien', 'damiendunn@1utar.my', '$2y$10$CM6U8VESyKH1T/t5L5484u1HbXY5TqVZk3FfHJPSCGSXWrxRDMi7C', '2025-04-14 12:30:49', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `vote_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `entry_id` int(11) NOT NULL,
  `vote_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `voted` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`vote_id`, `user_id`, `entry_id`, `vote_date`, `voted`) VALUES
(10, 2, 6, '2025-04-14 12:56:11', 1),
(11, 3, 7, '2025-04-14 13:01:39', 1),
(12, 2, 7, '2025-04-15 08:44:37', 1),
(13, 2, 3, '2025-04-15 08:44:42', 1),
(14, 2, 8, '2025-04-15 08:51:39', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `competitions`
--
ALTER TABLE `competitions`
  ADD PRIMARY KEY (`competition_id`),
  ADD KEY `fk_winner_entry` (`winner_entry_id`);

--
-- Indexes for table `competition_entries`
--
ALTER TABLE `competition_entries`
  ADD PRIMARY KEY (`entry_id`),
  ADD UNIQUE KEY `unique_entry` (`competition_id`,`recipe_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `favorite_recipes`
--
ALTER TABLE `favorite_recipes`
  ADD PRIMARY KEY (`favorite_id`),
  ADD UNIQUE KEY `unique_favorite` (`user_id`,`recipe_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipe_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`vote_id`),
  ADD UNIQUE KEY `unique_vote` (`entry_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `competitions`
--
ALTER TABLE `competitions`
  MODIFY `competition_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `competition_entries`
--
ALTER TABLE `competition_entries`
  MODIFY `entry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `favorite_recipes`
--
ALTER TABLE `favorite_recipes`
  MODIFY `favorite_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `recipe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `vote_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `competitions`
--
ALTER TABLE `competitions`
  ADD CONSTRAINT `fk_winner_entry` FOREIGN KEY (`winner_entry_id`) REFERENCES `competition_entries` (`entry_id`);

--
-- Constraints for table `competition_entries`
--
ALTER TABLE `competition_entries`
  ADD CONSTRAINT `competition_entries_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`competition_id`),
  ADD CONSTRAINT `competition_entries_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`);

--
-- Constraints for table `favorite_recipes`
--
ALTER TABLE `favorite_recipes`
  ADD CONSTRAINT `favorite_recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `favorite_recipes_ibfk_3` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE;

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`entry_id`) REFERENCES `competition_entries` (`entry_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
