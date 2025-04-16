"use client";

import { ArrowLeft, ChevronDown, Filter, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { RecipeCard } from "@/components/ui/recipe-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

// Function to get cookie value by name
function getCookie(name: string): string | null {
  if (typeof document === "undefined" || !document.cookie) return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift()!;
  return null;
}

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
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [sortFilter, setSortFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<number | null>(null);
  const ITEMS_PER_PAGE = 12;

  // Get current user ID and admin status from cookie when component mounts
  useEffect(() => {
    const userId = getCookie("user_id");
    setCurrentUserId(userId);

    // Check admin status
    const checkAdminStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost/server/php/recipes/api/admin.php",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "check_admin",
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setIsAdmin(data.is_admin);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    if (userId) {
      checkAdminStatus();
      fetchFavoriteRecipes(); // Fetch favorite recipes when user ID is available
    }
  }, []);

  // Fetch user's favorite recipes
  const fetchFavoriteRecipes = async () => {
    try {
      setLoadingFavorites(true);
      const response = await fetch(
        "http://localhost/server/php/recipes/api/user.php?action=favorites",
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched favorite recipes:", data);

        // Convert favourite to number if it's not already
        const processedData = data.map((recipe: Recipe) => ({
          ...recipe,
          favourite: 1, // These are all favorites
          user_id: Number(recipe.user_id),
        }));

        setFavoriteRecipes(processedData);
      }
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const fetchRecipes = async (pageNum: number, isRefresh = false) => {
    try {
      if (isRefresh) {
        setLoading(true);
      }
      const response = await fetch(
        `http://localhost/server/php/recipes/api/recipes.php?page=${pageNum}&limit=${ITEMS_PER_PAGE}${
          searchQuery ? `&search=${searchQuery}` : ""
        }`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );
      if (response.ok) {
        const data = await response.json();
        // Convert favourite to number if it's not already
        const processedData = data.map((recipe: Recipe) => ({
          ...recipe,
          favourite: Number(recipe.favourite),
          user_id: Number(recipe.user_id), // Ensure user_id is a number
        }));

        if (pageNum === 1 || isRefresh) {
          setRecipes(processedData);
        } else {
          setRecipes((prev) => [...prev, ...processedData]);
        }

        // If we received fewer items than the limit, we've reached the end
        setHasMore(processedData.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRecipes(1);
  }, [searchQuery]);

  // Setup refresh on focus
  useEffect(() => {
    const handleFocus = () => {
      fetchRecipes(1, true);
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRecipes(nextPage);
    }
  };

  // Reset page when search or filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [searchQuery, difficultyFilter]);

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
        `http://localhost/server/php/recipes/api/recipes.php?id=${recipeId}`,
        {
          method: "PUT",
          credentials: "include",
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

        // If adding to favorites, add to favorite recipes list
        if (newFavouriteValue === 1) {
          const recipeToAdd = recipes.find((r) => r.recipe_id === recipeId);
          if (
            recipeToAdd &&
            !favoriteRecipes.some((r) => r.recipe_id === recipeId)
          ) {
            setFavoriteRecipes((prev) => [
              ...prev,
              { ...recipeToAdd, favourite: 1 },
            ]);
          }
        }
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

  const handleDeleteClick = (recipeId: number) => {
    setRecipeToDelete(recipeId);
  };

  const handleDelete = async (recipeId: number) => {
    if (!isAdmin) return;

    try {
      const response = await fetch(
        `http://localhost/server/php/recipes/api/recipes.php?id=${recipeId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Remove the deleted recipe from the state
        setRecipes((prev) =>
          prev.filter((recipe) => recipe.recipe_id !== recipeId)
        );

        // Show success toast
        toast({
          title: "Recipe Deleted",
          description: "The recipe has been successfully deleted.",
        });
      } else {
        // Try to parse the response as JSON, but handle the case where it's not valid JSON
        let errorMessage = "Failed to delete recipe";
        try {
          const text = await response.text();
          if (text) {
            const data = JSON.parse(text);
            errorMessage = data.error || data.message || errorMessage;
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
        }

        // Show error toast
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      // Show error toast for network/unexpected errors
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the recipe.",
        variant: "destructive",
      });
    } finally {
      setRecipeToDelete(null);
    }
  };

  const filteredRecipes = recipes
    .filter((recipe) => {
      // Apply difficulty filter
      if (difficultyFilter) {
        return (
          recipe.difficulty &&
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
      <Toaster />
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
                isAdmin={isAdmin}
                onDelete={() => handleDeleteClick(recipe.recipe_id)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="my-recipes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {currentUserId ? (
              recipes
                .filter((r) => {
                  const userIdNum = parseInt(currentUserId);
                  return r.user_id === userIdNum;
                })
                .map((recipe) => (
                  <RecipeCard
                    key={recipe.recipe_id}
                    recipe={recipe}
                    onFavourite={() =>
                      handleFavourite(recipe.recipe_id, recipe.favourite)
                    }
                    isAdmin={isAdmin}
                    onDelete={() => handleDeleteClick(recipe.recipe_id)}
                  />
                ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p>Please log in to view your recipes</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {currentUserId ? (
              loadingFavorites ? (
                <div className="col-span-3 text-center py-10">
                  <p>Loading your favorite recipes...</p>
                </div>
              ) : favoriteRecipes.length > 0 ? (
                favoriteRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.recipe_id}
                    recipe={recipe}
                    onFavourite={() => {
                      handleFavourite(recipe.recipe_id, recipe.favourite);
                      // Remove from favorites list immediately for better UX
                      setFavoriteRecipes((prev) =>
                        prev.filter((r) => r.recipe_id !== recipe.recipe_id)
                      );
                    }}
                    isAdmin={isAdmin}
                    onDelete={() => handleDeleteClick(recipe.recipe_id)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p>You haven't favorited any recipes yet</p>
                </div>
              )
            ) : (
              <div className="col-span-3 text-center py-10">
                <p>Please log in to view your favorite recipes</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {currentUserId ? (
              recipes
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
                    isAdmin={isAdmin}
                    onDelete={() => handleDeleteClick(recipe.recipe_id)}
                  />
                ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p>Please log in to view your recently viewed recipes</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-12">
        {hasMore && (
          <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More Recipes"}
          </Button>
        )}
      </div>

      <AlertDialog
        open={recipeToDelete !== null}
        onOpenChange={() => setRecipeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => recipeToDelete && handleDelete(recipeToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
