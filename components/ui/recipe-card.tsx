import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Clock, Trash2 } from "lucide-react";
import Link from "next/link";

interface Recipe {
  recipe_id: number;
  title: string;
  description: string;
  image_url?: string;
  prep_time: number;
  cook_time: number;
  cuisine?: string;
  difficulty?: string;
  favourite: number;
}

interface RecipeCardProps {
  recipe: Recipe;
  onFavourite: () => void;
  isAdmin?: boolean;
  onDelete?: () => void;
}

export function RecipeCard({
  recipe,
  onFavourite,
  isAdmin = false,
  onDelete,
}: RecipeCardProps) {
  const totalTime = Number(recipe.prep_time) + Number(recipe.cook_time);

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-shadow h-[400px] flex flex-col">
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-primary/10">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 text-primary/40">🍽️</div>
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            onFavourite();
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              recipe.favourite === 1
                ? "fill-rose-500 text-rose-500"
                : "text-muted-foreground"
            }`}
          />
        </button>
        <div className="absolute top-3 left-3">
          <div className="bg-background/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
            {totalTime} mins
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="mb-2">
          <Link
            href={`/recipes/${recipe.recipe_id}`}
            className="hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-lg line-clamp-1">
              {recipe.title}
            </h3>
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {recipe.cuisine && (
            <Badge variant="outline" className="bg-primary/10">
              {recipe.cuisine}
            </Badge>
          )}
          {recipe.difficulty && (
            <Badge variant="outline" className="bg-primary/10">
              {recipe.difficulty}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm flex-1">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {totalTime} mins
          </div>
          <div className="flex gap-2 items-center">
            {isAdmin && onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete();
                }}
                className="p-2 rounded-full bg-background hover:bg-background/90 transition-colors text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/recipes/${recipe.recipe_id}`}>View Recipe</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
