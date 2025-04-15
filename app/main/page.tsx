"use client";

import { ArrowRight, Calendar, ChefHat, Trophy, Users } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecipeCard } from "@/components/ui/recipe-card";

interface Recipe {
  difficulty: string;
  cuisine: string;
  recipe_id: number;
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

export default function Home() {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          "http://localhost/server/php/recipes/api/recipes.php?limit=100",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Convert favourite to number if it's not already
          const processedData = data.map((recipe: Recipe) => ({
            ...recipe,
            favourite: Number(recipe.favourite),
          }));
          setFeaturedRecipes(processedData.slice(0, 3)); // Only show first 3 recipes
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleFavourite = async (
    recipeId: number,
    currentFavourite: number
  ) => {
    try {
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

      if (response.ok) {
        setFeaturedRecipes((prev) =>
          prev.map((recipe) =>
            recipe.recipe_id === recipeId
              ? { ...recipe, favourite: newFavouriteValue }
              : recipe
          )
        );
      }
    } catch (error) {
      console.error("Error updating favourite status:", error);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-6">
                Your Culinary Journey{" "}
                <span className="text-primary">Starts Here</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-md">
                Discover, create, and share amazing recipes. Join cooking
                competitions and connect with food enthusiasts around the world.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/recipes">Explore Recipes</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/register">Join Community</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <ChefHat className="w-32 h-32 text-primary" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-xl bg-primary/10 -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-xl bg-primary/10 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need in One Place
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            CookMaster brings together all the tools you need to elevate your
            cooking experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<ChefHat className="w-12 h-12 text-primary" />}
            title="Recipe Management"
            description="Create, store, and search for recipes with ingredients, steps, and cuisine types."
            href="/recipes"
          />

          <FeatureCard
            icon={<Calendar className="w-12 h-12 text-primary" />}
            title="Meal Planning"
            description="Plan meals for days or weeks ahead. Select recipes or add custom meals."
            href="/meal-planning"
          />

          <FeatureCard
            icon={<Users className="w-12 h-12 text-primary" />}
            title="Community"
            description="Connect with other cooking enthusiasts. Share tips and get inspired."
            href="/community"
          />

          <FeatureCard
            icon={<Trophy className="w-12 h-12 text-primary" />}
            title="Competitions"
            description="Participate in cooking contests. Submit recipes and win recognition."
            href="/competitions"
          />
        </div>
      </div>

      {/* Featured Recipes */}
      <div className="bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Recipes</h2>
            <Button variant="outline" asChild>
              <Link href="/recipes">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.recipe_id}
                  recipe={recipe}
                  onFavourite={() =>
                    handleFavourite(recipe.recipe_id, recipe.favourite)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto py-20 px-4">
        <div className="bg-primary/10 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Culinary Adventure?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of food enthusiasts who are already creating,
            sharing, and discovering amazing recipes.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Create Free Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-fit">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center pb-4">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="ghost" className="w-full">
          <Link href={href}>
            Explore <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
