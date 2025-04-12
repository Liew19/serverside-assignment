"use client";

import {
  ArrowLeft,
  Clock,
  Edit,
  Heart,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `http://localhost/assignmentbackend/api/recipes.php?id=${params.id}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const recipeData = data[0];
            // Convert string ingredients and instructions to arrays
            setRecipe({
              ...recipeData,
              favourite: Number(recipeData.favourite),
              ingredients: recipeData.ingredients
                ? recipeData.ingredients.split("\n")
                : [],
              instructions: recipeData.instructions
                ? recipeData.instructions.split("\n")
                : [],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  const handleFavourite = async () => {
    try {
      const newFavouriteValue = recipe.favourite === 1 ? 0 : 1;
      const response = await fetch(
        `http://localhost/assignmentbackend/api/recipes.php?id=${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ favourite: newFavouriteValue }),
        }
      );

      if (response.ok) {
        setRecipe((prev: any) => ({
          ...prev,
          favourite: newFavouriteValue,
        }));
      }
    } catch (error) {
      console.error("Error updating favourite status:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this recipe? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost/assignmentbackend/api/recipes.php?id=${params.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          router.push("/recipes"); // Redirect to recipes page after successful deletion
        } else {
          console.error("Failed to delete recipe");
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10 px-4">Loading...</div>;
  }

  if (!recipe) {
    return <div className="container mx-auto py-10 px-4">Recipe not found</div>;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRecipe((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setRecipe((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe((prev: any) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe((prev: any) => ({
      ...prev,
      instructions: newInstructions,
    }));
  };

  const addIngredient = () => {
    setRecipe((prev: any) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const addInstruction = () => {
    setRecipe((prev: any) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  const removeIngredient = (index: number) => {
    setRecipe((prev: any) => ({
      ...prev,
      ingredients: prev.ingredients.filter(
        (_: string, i: number) => i !== index
      ),
    }));
  };

  const removeInstruction = (index: number) => {
    setRecipe((prev: any) => ({
      ...prev,
      instructions: prev.instructions.filter(
        (_: string, i: number) => i !== index
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost/assignmentbackend/api/recipes.php?id=${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...recipe,
            ingredients: recipe.ingredients.join("\n"),
            instructions: recipe.instructions.join("\n"),
          }),
        }
      );

      if (response.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        console.error("Failed to update recipe");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/recipes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recipes
        </Link>
      </Button>

      {loading ? (
        <div>Loading...</div>
      ) : !recipe ? (
        <div>Recipe not found</div>
      ) : isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  name="title"
                  value={recipe.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={recipe.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Prep Time (minutes)
                  </label>
                  <Input
                    name="prep_time"
                    type="number"
                    value={recipe.prep_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cook Time (minutes)
                  </label>
                  <Input
                    name="cook_time"
                    type="number"
                    value={recipe.cook_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine</Label>
                  <Select
                    value={recipe.cuisine || ""}
                    onValueChange={(value) =>
                      handleSelectChange("cuisine", value)
                    }
                  >
                    <SelectTrigger id="cuisine">
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={recipe.difficulty || ""}
                    onValueChange={(value) =>
                      handleSelectChange("difficulty", value)
                    }
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Servings
                  </label>
                  <Input
                    name="servings"
                    type="number"
                    value={recipe.servings}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Image URL
                </label>
                <Input
                  name="image_url"
                  value={recipe.image_url}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Ingredients</h2>
                <Button type="button" onClick={addIngredient} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Ingredient
                </Button>
              </div>
              <div className="space-y-4">
                {recipe.ingredients.map((ingredient: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ingredient}
                      onChange={(e) =>
                        handleIngredientChange(index, e.target.value)
                      }
                      placeholder={`Ingredient ${index + 1}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Instructions</h2>
                <Button
                  type="button"
                  onClick={addInstruction}
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-4">
                {recipe.instructions.map(
                  (instruction: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={instruction}
                        onChange={(e) =>
                          handleInstructionChange(index, e.target.value)
                        }
                        placeholder={`Step ${index + 1}`}
                        required
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeInstruction(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg">
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold">{recipe.title}</h1>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleFavourite}>
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    recipe.favourite === 1 ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
                {recipe.favourite === 1 ? "Favorited" : "Favorite"}
              </Button>
              <Button
                size="sm"
                className="bg-rose-500 hover:bg-rose-700"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {Number(recipe.prep_time) + Number(recipe.cook_time)} mins
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              {recipe.servings} servings
            </div>
          </div>

          <div className="relative aspect-[16/9] w-full mb-6 rounded-lg overflow-hidden bg-primary/10">
            {recipe.image_url ? (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">🍝</div>
              </div>
            )}
          </div>

          <p className="text-muted-foreground mb-8">{recipe.description}</p>

          <Tabs defaultValue="instructions" className="mb-8">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            </TabsList>

            <TabsContent value="instructions" className="mt-6">
              <ol className="space-y-6 list-decimal list-inside">
                {recipe.instructions.map((step: string, index: number) => (
                  <li key={index} className="pl-2">
                    <div className="inline font-medium">Step {index + 1}:</div>{" "}
                    {step}
                  </li>
                ))}
              </ol>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-6">
              <div className="bg-primary/5 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">
                    Ingredients for {recipe.servings} servings
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      -
                    </Button>
                    <span>{recipe.servings}</span>
                    <Button variant="outline" size="sm">
                      +
                    </Button>
                  </div>
                </div>
                <Separator className="mb-4" />
                <ul className="space-y-3">
                  {recipe.ingredients.map(
                    (ingredient: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-md border flex items-center justify-center">
                          <div className="h-3 w-3 rounded-sm bg-primary/0 hover:bg-primary/20 cursor-pointer transition-colors"></div>
                        </div>
                        <span>{ingredient}</span>
                      </li>
                    )
                  )}
                </ul>
                <Separator className="mt-4 mb-4" />
                <Button className="w-full">Add All To Shopping List</Button>
              </div>
            </TabsContent>
          </Tabs>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Recipe Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prep Time:</span>
                  <span>{recipe.prep_time} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cook Time:</span>
                  <span>{recipe.cook_time} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Time:</span>
                  <span>
                    {Number(recipe.prep_time) + Number(recipe.cook_time)} mins
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servings:</span>
                  <span>{recipe.servings}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
