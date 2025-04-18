-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2025 at 08:16 AM
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
-- Database: `recipe_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_Id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `post_id`, `user_Id`, `username`, `comment`, `created_at`, `updated_at`, `isDeleted`) VALUES
(2, 1, 1, 'TestUser', 'delicous', '2025-04-16 23:33:40', '2025-04-18 14:15:25', 1),
(3, 1, 1, 'Anonymous', 'good', '2025-04-17 03:01:51', '2025-04-18 14:15:29', 1),
(4, 1, 1, 'Anonymous', 'nice', '2025-04-17 03:01:54', '2025-04-18 14:15:32', 1),
(5, 1, 1, 'Anonymous', 'very nice', '2025-04-17 03:02:15', '2025-04-18 14:15:41', 0),
(6, 9, 1, 'Anonymous', 'thank you for sharing', '2025-04-17 03:02:29', '2025-04-18 14:15:54', 0),
(7, 9, 1, 'Anonymous', 'nice nice nice', '2025-04-17 12:05:00', '2025-04-18 14:16:07', 0),
(8, 8, 1, 'Anonymous', 'lookig good', '2025-04-17 13:14:05', '2025-04-18 14:16:11', 0);

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
(1, 'Spring Bake Off', 'A spring baking challenge', '2025-04-01', 'active', '2025-04-30', 100, '2025-04-28', NULL),
(2, 'MasterChef April', 'Monthly cook-off challenge', '2025-04-05', 'active', '2025-04-25', 150, '2025-04-24', NULL),
(3, 'Vegan Delights', 'Best vegan recipe wins!', '2025-03-30', 'past', '2025-04-16', 120, '2025-04-16', 7),
(4, 'Quick & Easy Meals', 'Fast recipes under 30 mins', '2025-04-10', 'active', '2025-04-22', 90, '2025-04-21', NULL),
(5, 'Family Feast', 'Home-style comfort food', '2025-04-02', 'past', '2025-04-16', 110, '2025-04-16', 6),
(6, 'Asian Cuisine Contest', 'Explore Asian flavors', '2025-04-01', 'active', '2025-04-30', 130, '2025-04-28', NULL),
(7, 'Grill Master Challenge', 'BBQ and grilled items', '2025-04-08', 'active', '2025-04-26', 140, '2025-04-25', NULL),
(8, 'Dessert Derby', 'Show off your sweets!', '2025-04-04', 'active', '2025-04-24', 100, '2025-04-23', NULL),
(9, 'Pasta Perfection', 'Best pasta dish contest', '2025-04-09', 'active', '2025-04-27', 90, '2025-04-26', NULL),
(10, 'Salad Stars', 'Fresh and healthy recipes', '2025-04-03', 'active', '2025-04-23', 80, '2025-04-22', NULL),
(11, 'BBQ Battle', 'Best BBQ recipe', '2025-05-01', 'upcoming', '2025-05-15', 150, '2025-05-13', NULL),
(12, 'Summer Smoothie Showdown', 'Refreshing smoothies to beat the heat', '2025-06-01', 'upcoming', '2025-06-15', 120, '2025-06-13', NULL);

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
  `submission_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `winner_entry_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `competition_entries`
--

INSERT INTO `competition_entries` (`entry_id`, `competition_id`, `recipe_id`, `is_deleted`, `delete_description`, `submission_date`, `winner_entry_id`) VALUES
(1, 1, 2, 0, NULL, '2025-04-16 01:11:19', NULL),
(2, 5, 2, 0, NULL, '2025-04-16 01:11:27', NULL),
(3, 9, 2, 0, NULL, '2025-04-16 01:11:33', NULL),
(4, 3, 2, 1, 'Vote is deleted to try out', '2025-04-16 01:11:37', NULL),
(5, 4, 2, 0, NULL, '2025-04-16 01:11:56', NULL),
(6, 5, 1, 0, NULL, '2025-04-16 01:14:07', NULL),
(7, 3, 1, 0, NULL, '2025-04-16 01:14:14', NULL),
(8, 2, 1, 0, NULL, '2025-04-16 01:14:20', NULL),
(9, 8, 1, 0, NULL, '2025-04-16 01:14:28', NULL),
(10, 4, 4, 0, NULL, '2025-04-16 01:15:46', NULL),
(11, 9, 4, 0, NULL, '2025-04-16 01:15:59', NULL),
(12, 5, 3, 0, NULL, '2025-04-16 01:16:50', NULL),
(13, 3, 3, 0, NULL, '2025-04-16 01:16:55', NULL),
(14, 2, 5, 0, NULL, '2025-04-16 01:17:44', NULL),
(15, 3, 5, 0, NULL, '2025-04-16 01:17:48', NULL),
(16, 9, 5, 0, NULL, '2025-04-16 01:17:53', NULL),
(17, 5, 5, 0, NULL, '2025-04-16 01:17:57', NULL);

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
(1, 1, 8, '2025-04-16 01:19:04'),
(2, 1, 3, '2025-04-16 01:19:05'),
(3, 1, 5, '2025-04-17 05:27:33');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`post_id`, `user_id`, `created_at`) VALUES
(1, 1, '0000-00-00 00:00:00'),
(5, 1, '0000-00-00 00:00:00'),
(5, 2, '2025-04-17 16:20:41'),
(5, 3, '2025-04-17 16:20:41'),
(5, 4, '2025-04-17 16:20:41'),
(6, 1, '0000-00-00 00:00:00'),
(8, 1, '0000-00-00 00:00:00'),
(8, 2, '2025-04-17 16:20:41'),
(10, 1, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `meal_planning`
--

CREATE TABLE `meal_planning` (
  `meal_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('breakfast','lunch','dinner','snack') NOT NULL,
  `is_custom` tinyint(1) DEFAULT 0,
  `recipe_id` int(11) DEFAULT NULL,
  `meal_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`meal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meal_planning`
--

INSERT INTO `meal_planning` (`meal_id`, `user_id`, `name`, `type`, `is_custom`, `recipe_id`, `meal_date`, `created_at`) VALUES
(1, 2, 'French Onion Soup', 'dinner', 0, 7, '2025-04-17', '2025-04-16 16:30:12'),
(2, 3, 'Chicken Tikka Masala', 'dinner', 0, 2, '2025-04-17', '2025-04-16 17:15:22'),
(3, 2, 'Avocado Toast', 'breakfast', 0, 8, '2025-04-17', '2025-04-16 15:45:10'),
(4, 4, 'Greek Salad', 'lunch', 0, 9, '2025-04-17', '2025-04-16 18:30:45'),
(5, 5, 'Chocolate Chip Cookies', 'snack', 0, 5, '2025-04-17', '2025-04-16 23:20:18'),
(6, 1, 'Beef Stroganoff', 'dinner', 0, 3, '2025-04-18', '2025-04-17 02:45:30'),
(7, 3, 'French Onion Soup', 'lunch', 0, 7, '2025-04-18', '2025-04-17 03:12:05'),
(8, 5, 'Homemade Pizza', 'dinner', 0, 4, '2025-04-19', '2025-04-17 04:05:42'),
(9, 4, 'Morning Oatmeal', 'breakfast', 1, NULL, '2025-04-19', '2025-04-17 05:30:15'),
(10, 2, 'Avocado Toast', 'breakfast', 0, 8, '2025-04-19', '2025-04-17 06:10:38'),
(11, 3, 'Beef Tacos', 'lunch', 0, 6, '2025-04-20', '2025-04-17 15:25:19'),
(12, 6, 'Chicken Tikka Masala', 'dinner', 0, 2, '2025-04-20', '2025-04-17 17:40:52'),
(13, 2, 'Yogurt Parfait', 'breakfast', 1, NULL, '2025-04-21', '2025-04-17 18:15:27'),
(14, 5, 'Spaghetti Carbonara', 'dinner', 0, 1, '2025-04-21', '2025-04-17 19:05:33'),
(15, 3, 'Greek Salad', 'lunch', 0, 9, '2025-04-22', '2025-04-17 21:25:48'),
(16, 4, 'Homemade Pizza', 'dinner', 0, 4, '2025-04-22', '2025-04-17 22:50:21'),
(17, 1, 'Breakfast Burrito', 'breakfast', 1, NULL, '2025-04-23', '2025-04-18 16:35:14'),
(18, 6, 'Beef Stroganoff', 'dinner', 0, 3, '2025-04-23', '2025-04-18 17:20:37'),
(19, 3, 'Avocado Toast', 'breakfast', 0, 8, '2025-04-24', '2025-04-18 18:45:52'),
(20, 5, 'French Onion Soup', 'lunch', 0, 7, '2025-04-24', '2025-04-18 20:15:08'),
(21, 2, 'Beef Tacos', 'dinner', 0, 6, '2025-04-25', '2025-04-19 15:30:42'),
(22, 4, 'Smoothie Bowl', 'breakfast', 1, NULL, '2025-04-25', '2025-04-19 16:55:19'),
(23, 3, 'Chicken Tikka Masala', 'dinner', 0, 2, '2025-04-26', '2025-04-19 22:40:27'),
(24, 6, 'Greek Salad', 'lunch', 0, 9, '2025-04-26', '2025-04-20 00:20:33'),
(25, 2, 'Chocolate Chip Cookies', 'snack', 0, 5, '2025-04-27', '2025-04-20 17:10:11'),
(26, 5, 'Homemade Pizza', 'dinner', 0, 4, '2025-04-27', '2025-04-20 18:35:48'),
(27, 3, 'Avocado Toast', 'breakfast', 0, 8, '2025-04-28', '2025-04-20 19:50:22'),
(28, 4, 'Spaghetti Carbonara', 'dinner', 0, 1, '2025-04-28', '2025-04-20 21:25:37'),
(29, 2, 'Beef Stroganoff', 'lunch', 0, 3, '2025-04-29', '2025-04-21 16:40:15'),
(30, 6, 'Overnight Chia Pudding', 'breakfast', 1, NULL, '2025-04-30', '2025-04-21 17:15:53'),
(31, 2, 'Spaghetti Carbonara', 'lunch', 0, 1, '2025-04-17', '2025-04-16 21:51:42'),
(32, 2, 'Greek Salad', 'dinner', 0, 9, '2025-04-17', '2025-04-16 21:51:59'),
(33, 2, 'Chocolate Chip Cookies', 'snack', 0, 5, '2025-04-17', '2025-04-16 21:52:13'),
(34, 2, 'Homemade Pizza', 'lunch', 0, NULL, '2025-04-17', '2025-04-16 21:53:52');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `user_id`, `title`, `description`, `ingredients`, `instructions`, `prep_time`, `cook_time`, `servings`, `image_url`, `created_at`, `cuisine`, `difficulty`, `is_deleted`) VALUES
(1, 3, 'Spaghetti Carbonara', 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.', '400g spaghetti\n200g pancetta or guanciale, diced\n4 large eggs\n100g Pecorino Romano cheese, grated\n50g Parmesan cheese, grated\nFreshly ground black pepper\nSalt to taste', '1. Cook the spaghetti in salted water according to package instructions until al dente.\n2. While the pasta is cooking, fry the pancetta in a large pan until crispy.\n3. In a bowl, whisk together the eggs, grated cheeses, and black pepper.\n4. Drain the pasta, reserving a little cooking water.\n5. Working quickly, add the hot pasta to the pancetta, then remove from heat.\n6. Add the egg and cheese mixture, stirring quickly to create a creamy sauce.\n7. If needed, add a splash of the reserved pasta water to create a creamy sauce.\n8. Serve immediately with additional grated cheese and black pepper on top.', 15, 15, 5, '/images/recipes/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157_2.jpg', '2025-04-09 10:01:35', 'italian', 'easy', 0),
(2, 1, 'Chicken Tikka Masala', 'Grilled chunks of chicken enveloped in a creamy spiced tomato sauce.', '800g boneless chicken thighs, cut into bite-sized pieces\n2 cups plain yogurt\n3 tbsp lemon juice\n4 tsp ground cumin\n4 tsp ground coriander\n2 tsp ground turmeric\n2 tsp garam masala\n2 tsp salt\n2 tbsp vegetable oil\n1 large onion, finely chopped\n4 garlic cloves, minced\n2 tbsp grated fresh ginger\n2 tsp ground paprika\n1 can (400g) tomato sauce\n1 cup heavy cream\nFresh cilantro for garnish', '1. In a large bowl, combine yogurt, lemon juice, cumin, coriander, turmeric, garam masala, and salt.\n2. Add chicken pieces and stir to coat. Marinate for at least 1 hour, preferably overnight.\n3. Preheat grill or broiler. Thread chicken onto skewers and grill until charred and cooked through.\n4. Heat oil in a large pan over medium heat. Add onion and cook until softened.\n5. Add garlic and ginger, cook for 1 minute. Add paprika and cook for another minute.\n6. Add tomato sauce and simmer for 15 minutes.\n7. Add grilled chicken and simmer for 10 minutes.\n8. Stir in cream and simmer until heated through.\n9. Garnish with fresh cilantro and serve with rice or naan.', 30, 45, 6, '/images/recipes/1400x919-Chicken-tikka-masala-43fcdbd8-eb86-4b55-951d-adda29067afa-0-1400x919_1.jpg', '2025-04-09 10:01:35', 'indian', 'medium', 0),
(3, 5, 'Beef Stroganoff', 'Tender strips of beef in a rich, creamy mushroom sauce served over noodles.', '700g beef sirloin, thinly sliced\n2 tbsp vegetable oil\n2 tbsp butter\n1 large onion, finely chopped\n400g mushrooms, sliced\n3 cloves garlic, minced\n2 tbsp all-purpose flour\n2 cups beef broth\n1 tbsp Dijon mustard\n1 tbsp Worcestershire sauce\n1 cup sour cream\nSalt and pepper to taste\n500g egg noodles, cooked\nChopped fresh parsley for garnish', '1. Season beef with salt and pepper.\n2. Heat oil in a large skillet over high heat. Add beef in batches and cook until browned, about 1 minute per side. Remove and set aside.\n3. In the same pan, melt butter. Add onions and cook until softened, about 3 minutes.\n4. Add mushrooms and garlic, cook until mushrooms are golden, about 5 minutes.\n5. Sprinkle flour over the mixture and stir for 1 minute.\n6. Gradually add beef broth, stirring constantly. Bring to a simmer.\n7. Stir in mustard and Worcestershire sauce. Simmer for 5 minutes until thickened.\n8. Reduce heat to low, stir in sour cream until combined.\n9. Return beef to the pan and heat through, about 2 minutes.\n10. Serve over cooked egg noodles and garnish with parsley.', 20, 25, 6, '/images/recipes/16311-simple-beef-stroganoff-DDMFS-4x3-1e966286eef54c0f96c882e569926eb3_1.jpg', '2025-04-09 10:11:59', 'italian', 'medium', 0),
(4, 4, 'Homemade Pizza', 'Classic homemade pizza with a crispy crust, tangy tomato sauce, and melty cheese.', 'For the dough:\n3 1/2 cups all-purpose flour\n1 tsp sugar\n1 envelope instant dry yeast\n2 tsp salt\n1 1/2 cups warm water\n2 tbsp olive oil, plus more for brushing\nFor the sauce:\n1 can (28oz) crushed tomatoes\n2 tbsp olive oil\n2 cloves garlic, minced\n1 tsp dried oregano\n1 tsp dried basil\nSalt and pepper to taste\nFor the toppings:\n2 cups shredded mozzarella cheese\n1/2 cup grated Parmesan cheese\nToppings of your choice (pepperoni, mushrooms, bell peppers, etc.)', 'For the dough:\n1. In a large bowl, combine flour, sugar, yeast, and salt.\n2. Add warm water and olive oil, stir until a dough forms.\n3. Knead on a floured surface for 5-7 minutes until smooth and elastic.\n4. Place in an oiled bowl, cover, and let rise for 1 hour or until doubled in size.\nFor the sauce:\n1. In a saucepan, heat olive oil over medium heat.\n2. Add garlic and cook for 30 seconds until fragrant.\n3. Add crushed tomatoes, oregano, basil, salt, and pepper.\n4. Simmer for 15-20 minutes until thickened.\nAssembly:\n1. Preheat oven to 475°F (245°C) with a pizza stone if available.\n2. Divide dough in half. Roll each half into a 12-inch circle.\n3. Place on a cornmeal-dusted pizza peel or baking sheet.\n4. Spread sauce over dough, leaving a 1-inch border.\n5. Sprinkle with cheeses and add desired toppings.\n6. Bake for 12-15 minutes until crust is golden and cheese is bubbly.\n7. Let cool slightly before slicing.', 30, 15, 4, '/images/recipes/homemade-pizza-monterey-jack-cheese_1.jpg', '2025-04-09 10:11:59', 'italian', 'hard', 0),
(5, 6, 'Chocolate Chip Cookies', 'Classic homemade cookies with chocolate chips and a soft, chewy center.', '2 1/4 cups all-purpose flour\n1 tsp baking soda\n1 tsp salt\n1 cup unsalted butter, softened\n3/4 cup granulated sugar\n3/4 cup packed brown sugar\n2 large eggs\n2 tsp vanilla extract\n2 cups semi-sweet chocolate chips\n1 cup chopped nuts (optional)', '1. Preheat oven to 375°F (190°C).\n2. In a small bowl, combine flour, baking soda, and salt.\n3. In a large bowl, cream together butter, granulated sugar, and brown sugar until smooth.\n4. Beat in eggs one at a time, then stir in vanilla.\n5. Gradually blend in the dry ingredients.\n6. Stir in chocolate chips and nuts if using.\n7. Drop by rounded tablespoons onto ungreased baking sheets.\n8. Bake for 9 to 11 minutes or until golden brown.\n9. Let stand on baking sheet for 2 minutes, then remove to cool on wire racks.', 20, 10, 24, '/images/recipes/chocolate-chip-cookie-recipe_1.jpg', '2025-04-09 10:11:59', 'american', 'medium', 0),
(6, 1, 'Beef Tacos', 'Seasoned ground beef in crispy taco shells with fresh toppings.', '1 lb ground beef\n1 onion, finely chopped\n2 cloves garlic, minced\n2 tbsp taco seasoning\n1/2 cup water\n12 taco shells\n2 cups shredded lettuce\n2 tomatoes, diced\n1 cup shredded cheddar cheese\n1/2 cup sour cream\n1/4 cup chopped fresh cilantro\nHot sauce to taste', '1. In a large skillet over medium-high heat, cook ground beef and onion until beef is browned.\n2. Add garlic and cook for 1 minute.\n3. Stir in taco seasoning and water. Bring to a simmer and cook until thickened, about 5 minutes.\n4. Meanwhile, heat taco shells according to package directions.\n5. Fill shells with beef mixture.\n6. Top with lettuce, tomatoes, cheese, sour cream, and cilantro.\n7. Serve with hot sauce on the side.', 15, 15, 4, '/images/recipes/Final_3_Crispy_Baked_Beef_Tacos_grain-free-dairy-free_1.jpg', '2025-04-09 10:11:59', 'mexican', 'medium', 0),
(7, 5, 'French Onion Soup', 'Rich beef broth with caramelized onions, topped with crusty bread and melted cheese.', '4 large onions, thinly sliced\n3 tbsp butter\n1 tbsp olive oil\n1 tsp sugar\n2 cloves garlic, minced\n1/4 cup dry white wine\n6 cups beef broth\n1 bay leaf\n2 sprigs fresh thyme\nSalt and pepper to taste\n8 slices French bread, toasted\n2 cups grated Gruyère cheese', '1. In a large pot, melt butter with olive oil over medium heat.\n2. Add onions and sugar, cook for 30-40 minutes, stirring occasionally, until deeply caramelized.\n3. Add garlic and cook for 1 minute.\n4. Pour in wine and scrape up any browned bits from the bottom of the pot.\n5. Add beef broth, bay leaf, and thyme. Bring to a simmer.\n6. Cover and simmer for 30 minutes. Season with salt and pepper.\n7. Preheat broiler. Ladle soup into oven-safe bowls.\n8. Place a slice of toasted bread on top of each bowl of soup.\n9. Sprinkle generously with Gruyère cheese.\n10. Broil until cheese is melted and bubbly, about 2-3 minutes.\n11. Serve immediately.', 15, 75, 4, '/images/recipes/French-Onion-Soup-square-FS_1.jpg', '2025-04-09 10:11:59', 'chinese', 'medium', 0),
(8, 2, 'Avocado Toast', 'Simple and delicious breakfast', 'Bread, Avocado, Salt, Pepper, Red Pepper Flakes', '1. Toast bread\n2. Mash avocado\n3. Spread on toast\n4. Season', 5, 2, 1, '/images/recipes/avocado-toast-with-everything-bagel-seasoning-feat_1.jpg', '2025-04-13 05:38:16', 'mexican', 'easy', 0),
(9, 2, 'Greek Salad', 'A refreshing Mediterranean salad made with crisp vegetables, tangy feta cheese, and a zesty dressing.', '2 large tomatoes, chopped\\n1 cucumber, sliced\\n1/2 red onion, thinly sliced\\n1/2 cup Kalamata olives\\n100g feta cheese, cubed\\n1 tsp dried oregano\\n3 tbsp extra virgin olive oil\\n1 tbsp red wine vinegar\\nSalt and pepper to taste', '1. In a large bowl, combine tomatoes, cucumber, red onion, and olives.\\n2. Gently toss in the cubed feta cheese.\\n3. In a small bowl, whisk together olive oil, red wine vinegar, oregano, salt, and pepper.\\n4. Pour the dressing over the salad and toss gently to combine.\\n5. Serve immediately or chill slightly before serving.', 15, 0, 4, '/images/recipes/Simply-Recipes-Easy-Greek-Salad-LEAD-2-4601eff771fd4de38f9722e8cafc897a_1.jpg', '2025-04-15 11:04:40', 'american', 'medium', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `role` enum('user','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `created_at`, `role`) VALUES
(1, 'admin123', 'admin@example.com', '$2a$12$MN6gB9WcZfZL/tNLK/u/COR3dm6pHHDnlnacjUrLkUDfjqCjr4KKC', '2025-04-13 05:38:16', 'admin'),
(2, 'john_doe', 'john@example.com', '$2a$12$I0xozaPCxrmXPK7lcg81Nu59rbOHJZU0fmhbcuUZ16JVVK.7cVWGq', '2025-04-13 05:38:16', 'user'),
(3, 'jane_smith', 'jane@example.com', '$2a$12$o0Vn8CrX1MDx2ijA/9Ir1Oo/nTEeFELqb2qC/Yt6LiLBbw56zLj0W', '2025-04-13 05:38:16', 'user'),
(4, 'chef_mike', 'mike@cooking.com', '$2a$12$LS6jzP53K/VkTrdRrSzBJO8tZ3apWUatj3N1mUiSVHENmD0NvJ71m', '2025-04-13 05:38:16', 'user'),
(5, 'foodie_lisa', 'lisa@foodblog.com', '$2a$12$lwLjX9IRG9IFdcAQViFq5eQX5PMJjGuzEn9CnY9Zz07dOCsgqQ.yq', '2025-04-13 05:38:16', 'user'),
(6, 'gordon_r', 'gordon@cuisine.net', '$2a$12$w.VfOCqcV9Fq6SuwbGusluTlGPrnMZ9m90umXm6uEAiqgORIUhHWm', '2025-04-13 05:38:16', 'user'),
(7, 'damien', 'damiendunn@1utar.my', '$2y$10$CM6U8VESyKH1T/t5L5484u1HbXY5TqVZk3FfHJPSCGSXWrxRDMi7C', '2025-04-14 04:30:49', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `user_post`
--

CREATE TABLE `user_post` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `imageURL` varchar(512) DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_post`
--

INSERT INTO `user_post` (`post_id`, `user_id`, `created_at`, `updated_at`, `title`, `content`, `imageURL`, `isDeleted`) VALUES
(1, 1, '2025-04-16 14:20:17', '2025-04-17 17:58:55', 'Spaghetti Carbonara', 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.', '', 0),
(2, 1, '2025-04-16 18:29:45', '2025-04-18 00:13:24', 'Chicken Tikka Masala', 'Chicken Tikka Masala', '', 0),
(3, 1, '2025-04-16 20:40:13', '2025-04-17 23:27:56', 'Beef Stroganoff', 'Tender strips of beef in a rich, creamy mushroom sauce served over noodles.', 'images/community/post_68011dfc8657d.png', 0),
(4, 2, '2025-04-25 16:00:09', '2025-04-25 16:00:09', 'Homemade Pizza', 'Homemade Pizza', '', 0),
(5, 1, '2025-04-17 23:02:23', '2025-04-18 00:04:59', 'French Onion Soup', 'Rich beef broth with caramelized onions, topped with crusty bread and melted cheese.', 'images/community/post_680126ab2d188.jpeg', 1),
(6, 1, '2025-04-18 11:51:31', '2025-04-18 11:57:43', 'Greek Salad', 'A refreshing Mediterranean salad made with crisp vegetables, tangy feta cheese, and a zesty dressing.', '', 0),
(7, 6, '2025-04-18 13:03:03', '2025-04-18 13:03:03', 'Avocado Toast', 'Simple and delicious breakfast', '', 0);

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
(1, 3, 7, '2025-04-16 01:14:15', 1),
(2, 3, 4, '2025-04-16 01:14:16', 1),
(3, 4, 10, '2025-04-16 01:15:48', 1),
(4, 4, 6, '2025-04-16 01:15:51', 1),
(5, 4, 9, '2025-04-16 01:15:54', 1),
(6, 4, 7, '2025-04-16 01:15:56', 1),
(7, 4, 3, '2025-04-16 01:16:01', 1),
(8, 4, 11, '2025-04-16 01:16:06', 1),
(9, 5, 7, '2025-04-16 01:16:56', 1),
(10, 5, 10, '2025-04-16 01:16:59', 1),
(11, 5, 5, '2025-04-16 01:17:00', 1),
(12, 5, 11, '2025-04-16 01:17:02', 1),
(13, 6, 6, '2025-04-16 01:17:59', 1),
(14, 6, 17, '2025-04-16 01:18:00', 1),
(15, 6, 12, '2025-04-16 01:18:01', 1),
(16, 6, 7, '2025-04-16 01:18:03', 1),
(17, 6, 9, '2025-04-16 01:18:05', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `competitions`
--
ALTER TABLE `competitions`
  ADD PRIMARY KEY (`competition_id`),
  ADD KEY `fk_winner` (`winner_entry_id`);

--
-- Indexes for table `competition_entries`
--
ALTER TABLE `competition_entries`
  ADD PRIMARY KEY (`entry_id`),
  ADD KEY `competition_id` (`competition_id`),
  ADD KEY `recipe_id` (`recipe_id`),
  ADD KEY `fk_winner_entry` (`winner_entry_id`);

--
-- Indexes for table `favorite_recipes`
--
ALTER TABLE `favorite_recipes`
  ADD PRIMARY KEY (`favorite_id`),
  ADD KEY `fk_user_id` (`user_id`),
  ADD KEY `fk_recipe_id` (`recipe_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`post_id`,`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_ibfk_1` (`email`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipe_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_post`
--
ALTER TABLE `user_post`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`vote_id`),
  ADD KEY `fk_votes_user_id` (`user_id`),
  ADD KEY `fk_votes_entry_id` (`entry_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `competitions`
--
ALTER TABLE `competitions`
  MODIFY `competition_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `competition_entries`
--
ALTER TABLE `competition_entries`
  MODIFY `entry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `favorite_recipes`
--
ALTER TABLE `favorite_recipes`
  MODIFY `favorite_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `recipe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user_post`
--
ALTER TABLE `user_post`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `vote_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `competitions`
--
ALTER TABLE `competitions`
  ADD CONSTRAINT `fk_winner` FOREIGN KEY (`winner_entry_id`) REFERENCES `competition_entries` (`entry_id`);

--
-- Constraints for table `competition_entries`
--
ALTER TABLE `competition_entries`
  ADD CONSTRAINT `competition_entries_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`competition_id`),
  ADD CONSTRAINT `competition_entries_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  ADD CONSTRAINT `fk_winner_entry` FOREIGN KEY (`winner_entry_id`) REFERENCES `competition_entries` (`entry_id`);

--
-- Constraints for table `favorite_recipes`
--
ALTER TABLE `favorite_recipes`
  ADD CONSTRAINT `fk_recipe_id` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE;

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `user_post`
--
ALTER TABLE `user_post`
  ADD CONSTRAINT `user_post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `fk_votes_entry_id` FOREIGN KEY (`entry_id`) REFERENCES `competition_entries` (`entry_id`),
  ADD CONSTRAINT `fk_votes_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
