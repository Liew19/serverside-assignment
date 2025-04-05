import type React from "react";
import Link from "next/link";
import { ChefHat, Calendar, Users, Trophy, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
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

interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  cuisine: string;
  difficulty: string;
  image: string;
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-primary/10 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <ChefHat className="h-12 w-12 text-primary/40" />
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-background/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
            {recipe.prepTime} mins
          </div>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            <Link
              href={`/recipes/${recipe.id}`}
              className="hover:text-primary transition-colors"
            >
              {recipe.title}
            </Link>
          </CardTitle>
        </div>
        <div className="flex gap-2 mt-1">
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
            {recipe.cuisine}
          </span>
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
            {recipe.difficulty}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {recipe.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Sample data
const featuredRecipes: Recipe[] = [
  {
    id: "1",
    title: "Spaghetti Carbonara",
    description:
      "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
    prepTime: 30,
    cuisine: "Italian",
    difficulty: "Medium",
    image: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Chicken Tikka Masala",
    description:
      "Grilled chunks of chicken enveloped in a creamy spiced tomato sauce.",
    prepTime: 45,
    cuisine: "Indian",
    difficulty: "Medium",
    image: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Greek Salad",
    description:
      "Fresh vegetables, olives, and feta cheese dressed with olive oil and herbs.",
    prepTime: 15,
    cuisine: "Greek",
    difficulty: "Easy",
    image: "/placeholder.svg",
  },
];
