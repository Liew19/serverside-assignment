This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Setup

### Prerequisites
- Node.js (version 16 or higher)
- PHP (version 7.4 or higher)
- MySQL
- Web server (Apache/XAMPP/WAMP)

### Database Setup
1. Create a new MySQL database named `recipe_database`
2. Make sure you have your MySQL credentials ready (username and password)
3. The database tables will be created automatically when you first run the application

### Backend Setup (PHP)
1. Copy the `php` folder to your web server's directory (e.g., `htdocs` for XAMPP)
2. Update the database connection in `php/database/database.php` if needed:
   - Default database name is `recipe_database`
   - Default host is `localhost`
   - Use your MySQL username and password when creating a new Database instance

### Frontend Setup (Next.js)
1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Create a `.env.local` file in the project root with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost/your-php-path
   ```
   Replace `your-php-path` with the path to your PHP files (e.g., if your PHP files are in `htdocs/server/php`, use `http://localhost/server/php`)

### Running the Project
1. Start your web server (Apache/XAMPP/WAMP)
2. Start your MySQL service
3. Run the Next.js development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Access the application at [http://localhost:3000](http://localhost:3000)

## Image Upload Configuration

Before running the application, you need to configure the image upload directory in the PHP backend:

1. Navigate to `php/recipes/api/upload.php`
2. Locate the `$uploadDir` variable
3. Replace the path with your project's absolute path to the public/images/recipes directory
4. Example:
```php
$uploadDir = 'C:/Your/Path/To/Project/public/images/recipes/'; need to have the '/' at last
```

Important notes:
- Use forward slashes (/) in the path, even on Windows
- Make sure the path points to your project's `public/images/recipes/` directory
- Ensure the directory exists and has write permissions
- The path should end with a forward slash (/)

### Steps to get the correct path:
1. Navigate to your project folder in File Explorer
2. Go to the `public/images/recipes` folder
3. Click in the address bar to see the full path
4. Copy the full path
5. Replace backslashes with forward slashes
6. Make sure the path ends with `/`

If the images directory doesn't exist:
1. Create a folder named `images` in your project's `public` directory
2. Inside the `images` folder, create a folder named `recipes`
