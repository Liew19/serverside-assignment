"use client";

import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Filter,
  Heart,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RecipeCard } from "@/components/ui/recipe-card";

interface Recipe {
  difficulty: string;
  cuisine: string;
  recipe_id: number;
  user_id: number;
  title: string;
  description: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url?: string;
  ingredients: string;
  instructions: string;
  created_at: string;
  favourite: number;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [sortFilter, setSortFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `http://localhost/assignmentbackend/api/recipes.php${
            searchQuery ? `?search=${searchQuery}` : ""
          }`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched recipes data:", data);
          // Convert favourite to number if it's not already
          const processedData = data.map((recipe: Recipe) => ({
            ...recipe,
            favourite: Number(recipe.favourite),
          }));
          console.log("Processed recipes data:", processedData);
          setRecipes(processedData);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFavourite = async (
    recipeId: number,
    currentFavourite: number
  ) => {
    try {
      console.log("Updating favourite:", { recipeId, currentFavourite });

      const newFavouriteValue = currentFavourite === 0 ? 1 : 0;

      const response = await fetch(
        `http://localhost/assignmentbackend/api/recipes.php?id=${recipeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ favourite: newFavouriteValue }),
        }
      );

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok && data.success && data.recipe) {
        console.log("Updating recipe state:", {
          oldFavourite: currentFavourite,
          newFavourite: data.recipe.favourite,
        });

        setRecipes((prev) =>
          prev.map((recipe) =>
            recipe.recipe_id === recipeId
              ? { ...recipe, favourite: newFavouriteValue }
              : recipe
          )
        );
      } else {
        console.error(
          "Failed to update favourite:",
          data.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error updating favourite status:", error);
    }
  };

  const filteredRecipes = recipes
    .filter((recipe) => {
      // Apply difficulty filter
      if (difficultyFilter) {
        return (
          recipe.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Apply sort filter
      switch (sortFilter) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "a-z":
          return a.title.localeCompare(b.title);
        case "prep-time":
          return a.prep_time - b.prep_time;
        default:
          return 0;
      }
    });

  const handleDifficultyFilter = (difficulty: string) => {
    setDifficultyFilter(difficulty);
  };

  const handleSortFilter = (sortType: string) => {
    setSortFilter(sortType);
  };

  if (loading) {
    return <div className="container mx-auto py-10 px-4">Loading...</div>;
  }

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
              value={searchQuery}
              onChange={handleSearch}
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
              <DropdownMenuItem onClick={() => handleDifficultyFilter("easy")}>
                Easy Difficulty
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDifficultyFilter("medium")}
              >
                Medium Difficulty
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDifficultyFilter("hard")}>
                Hard Difficulty
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficultyFilter(null)}>
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSortFilter("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortFilter("oldest")}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortFilter("a-z")}>
                A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortFilter("prep-time")}>
                Prep Time (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortFilter(null)}>
                Clear Sort
              </DropdownMenuItem>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.recipe_id}
                recipe={recipe}
                onFavourite={() =>
                  handleFavourite(recipe.recipe_id, recipe.favourite)
                }
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="my-recipes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {recipes
              .filter((r) => r.user_id === 1)
              .map((recipe) => (
                <RecipeCard
                  key={recipe.recipe_id}
                  recipe={recipe}
                  onFavourite={() =>
                    handleFavourite(recipe.recipe_id, recipe.favourite)
                  }
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {recipes
              .filter((r) => r.favourite === 1)
              .map((recipe) => (
                <RecipeCard
                  key={recipe.recipe_id}
                  recipe={recipe}
                  onFavourite={() =>
                    handleFavourite(recipe.recipe_id, recipe.favourite)
                  }
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {recipes
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .slice(0, 6)
              .map((recipe) => (
                <RecipeCard
                  key={recipe.recipe_id}
                  recipe={recipe}
                  onFavourite={() =>
                    handleFavourite(recipe.recipe_id, recipe.favourite)
                  }
                />
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
