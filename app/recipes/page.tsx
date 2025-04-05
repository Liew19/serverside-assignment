import Link from "next/link";
import {
  Clock,
  Filter,
  Plus,
  Search,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RecipesPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Recipes</h1>
          <p className="text-muted-foreground mt-1">
            Discover and manage your favorite recipes
          </p>
        </div>
        <Button asChild>
          <Link href="/recipes/create">
            <Plus className="mr-2 h-4 w-4" /> Add Recipe
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search recipes by name, ingredient, or cuisine..."
              className="w-full pl-8"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Easy Difficulty</DropdownMenuItem>
              <DropdownMenuItem>Medium Difficulty</DropdownMenuItem>
              <DropdownMenuItem>Hard Difficulty</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Newest First</DropdownMenuItem>
              <DropdownMenuItem>Oldest First</DropdownMenuItem>
              <DropdownMenuItem>A-Z</DropdownMenuItem>
              <DropdownMenuItem>Prep Time (Low to High)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:space-x-0">
          <TabsTrigger value="all" className="flex-1 md:flex-initial">
            All Recipes
          </TabsTrigger>
          <TabsTrigger value="my-recipes" className="flex-1 md:flex-initial">
            My Recipes
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex-1 md:flex-initial">
            Favorites
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex-1 md:flex-initial">
            Recently Viewed
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="my-recipes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes
              .filter((r) => r.isOwn)
              .map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes
              .filter((r) => r.isFavorite)
              .map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes
              .filter((r) => r.isRecent)
              .map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-12">
        <Button variant="outline">Load More Recipes</Button>
      </div>
    </div>
  );
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  cuisine: string;
  difficulty: string;
  rating?: number;
  isOwn?: boolean;
  isFavorite?: boolean;
  isRecent?: boolean;
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-primary/10 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 text-primary/40">🍽️</div>
        </div>
        {recipe.isFavorite && (
          <div className="absolute top-2 right-2">
            <div className="text-rose-500">❤️</div>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>
            <Link
              href={`/recipes/${recipe.id}`}
              className="hover:text-primary transition-colors"
            >
              {recipe.title}
            </Link>
          </CardTitle>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-primary/10">
            {recipe.cuisine}
          </Badge>
          <Badge variant="outline" className="bg-primary/10">
            {recipe.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {recipe.description}
        </p>

        {recipe.rating && (
          <div className="flex items-center mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.floor(recipe.rating!)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-1 text-sm text-muted-foreground">
              {recipe.rating}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          {recipe.prepTime} mins
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Sample data
const recipes: Recipe[] = [
  {
    id: "1",
    title: "Spaghetti Carbonara",
    description:
      "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
    prepTime: 30,
    cuisine: "Italian",
    difficulty: "Medium",
    rating: 4.8,
    isOwn: true,
    isFavorite: true,
    isRecent: true,
  },
  {
    id: "2",
    title: "Chicken Tikka Masala",
    description:
      "Grilled chunks of chicken enveloped in a creamy spiced tomato sauce.",
    prepTime: 45,
    cuisine: "Indian",
    difficulty: "Medium",
    rating: 4.6,
    isOwn: true,
    isRecent: true,
  },
  {
    id: "3",
    title: "Beef Tacos",
    description:
      "Seasoned ground beef in crispy taco shells with fresh toppings.",
    prepTime: 25,
    cuisine: "Mexican",
    difficulty: "Easy",
    rating: 4.5,
    isFavorite: true,
  },
  {
    id: "4",
    title: "Vegetable Stir Fry",
    description:
      "A quick and healthy mix of fresh vegetables cooked in a savory sauce.",
    prepTime: 20,
    cuisine: "Asian",
    difficulty: "Easy",
    rating: 4.2,
    isRecent: true,
  },
  {
    id: "5",
    title: "Greek Salad",
    description:
      "Fresh vegetables, olives, and feta cheese dressed with olive oil and herbs.",
    prepTime: 15,
    cuisine: "Greek",
    difficulty: "Easy",
    rating: 4.7,
    isFavorite: true,
  },
  {
    id: "6",
    title: "Chocolate Chip Cookies",
    description:
      "Classic homemade cookies with chocolate chips and a soft, chewy center.",
    prepTime: 35,
    cuisine: "Dessert",
    difficulty: "Easy",
    rating: 4.9,
    isOwn: true,
  },
];
