import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Edit,
  Heart,
  Share2,
  Star,
  Users,
  Bookmark,
  Printer,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export default function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real app, you would fetch the recipe data based on the ID
  const recipe = {
    id: params.id,
    title: "Spaghetti Carbonara",
    description:
      "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    cuisine: "Italian",
    difficulty: "Medium",
    author: {
      name: "Chef Mario",
      avatar: "/placeholder.svg",
      recipes: 42,
    },
    rating: 4.8,
    reviews: 124,
    ingredients: [
      "400g spaghetti",
      "200g pancetta or guanciale, diced",
      "4 large eggs",
      "100g Pecorino Romano cheese, grated",
      "50g Parmesan cheese, grated",
      "Freshly ground black pepper",
      "Salt to taste",
    ],
    instructions: [
      "Bring a large pot of salted water to boil and cook the spaghetti according to package instructions until al dente.",
      "While the pasta is cooking, heat a large skillet over medium heat. Add the diced pancetta and cook until crispy, about 5-7 minutes.",
      "In a bowl, whisk together the eggs, grated Pecorino Romano, and Parmesan cheese. Season with plenty of freshly ground black pepper.",
      "When the pasta is done, reserve 1/2 cup of the pasta water, then drain the pasta.",
      "Working quickly, add the hot pasta to the skillet with the pancetta, tossing to combine.",
      "Remove the skillet from the heat and pour in the egg and cheese mixture, tossing continuously until the eggs thicken but don't scramble.",
      "If needed, add a splash of the reserved pasta water to create a creamy sauce.",
      "Serve immediately with additional grated cheese and black pepper on top.",
    ],
    nutrition: {
      calories: 650,
      protein: 30,
      carbs: 65,
      fat: 28,
    },
    tips: [
      "Use room temperature eggs to prevent them from seizing up when added to the hot pasta.",
      "Traditional carbonara doesn't include cream - the creaminess comes from the eggs and cheese.",
      "Reserve some pasta water to help create a silky sauce if needed.",
    ],
    relatedRecipes: [
      {
        id: "7",
        title: "Cacio e Pepe",
        prepTime: 20,
        cuisine: "Italian",
      },
      {
        id: "8",
        title: "Pasta Amatriciana",
        prepTime: 35,
        cuisine: "Italian",
      },
      {
        id: "9",
        title: "Pasta Aglio e Olio",
        prepTime: 15,
        cuisine: "Italian",
      },
    ],
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/recipes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recipes
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">{recipe.title}</h1>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorite
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="bg-primary/10">
                {recipe.cuisine}
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                {recipe.difficulty}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {recipe.prepTime + recipe.cookTime} mins
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-4 w-4" />
                {recipe.servings} servings
              </div>
            </div>

            <div className="aspect-video bg-primary/10 rounded-lg mb-6 flex items-center justify-center">
              <div className="text-6xl">🍝</div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={recipe.author.avatar}
                  alt={recipe.author.name}
                />
                <AvatarFallback>{recipe.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{recipe.author.name}</div>
                <div className="text-sm text-muted-foreground">
                  {recipe.author.recipes} recipes
                </div>
              </div>
              <div className="ml-auto flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(recipe.rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">
                  {recipe.rating}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  ({recipe.reviews} reviews)
                </span>
              </div>
            </div>

            <p className="text-muted-foreground">{recipe.description}</p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button variant="outline" size="sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comment
              </Button>
            </div>
          </div>

          <Tabs defaultValue="instructions" className="mb-8">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="instructions" className="mt-6">
              <ol className="space-y-6 list-decimal list-inside">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="pl-2">
                    <div className="inline font-medium">Step {index + 1}:</div>{" "}
                    {step}
                  </li>
                ))}
              </ol>

              <div className="mt-8 bg-primary/5 rounded-lg p-4">
                <h3 className="font-medium mb-2">Chef&apos;s Tips</h3>
                <ul className="space-y-2">
                  {recipe.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="text-primary mt-1">💡</div>
                      <p className="text-sm">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
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
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-md border flex items-center justify-center">
                        <div className="h-3 w-3 rounded-sm bg-primary/0 hover:bg-primary/20 cursor-pointer transition-colors"></div>
                      </div>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
                <Separator className="mt-4 mb-4" />
                <Button className="w-full">Add All To Shopping List</Button>
              </div>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    {recipe.nutrition.calories}
                  </div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    {recipe.nutrition.protein}g
                  </div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    {recipe.nutrition.carbs}g
                  </div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    {recipe.nutrition.fat}g
                  </div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-medium mb-4">Nutritional Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span>Calories</span>
                    <span className="font-medium">
                      {recipe.nutrition.calories}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Total Fat</span>
                    <span className="font-medium">{recipe.nutrition.fat}g</span>
                  </div>
                  <div className="flex justify-between py-2 border-b pl-4">
                    <span className="text-muted-foreground">Saturated Fat</span>
                    <span className="font-medium">12g</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Total Carbohydrates</span>
                    <span className="font-medium">
                      {recipe.nutrition.carbs}g
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b pl-4">
                    <span className="text-muted-foreground">Dietary Fiber</span>
                    <span className="font-medium">3g</span>
                  </div>
                  <div className="flex justify-between py-2 border-b pl-4">
                    <span className="text-muted-foreground">Sugars</span>
                    <span className="font-medium">2g</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Protein</span>
                    <span className="font-medium">
                      {recipe.nutrition.protein}g
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Jane Smith" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Jane Smith</div>
                        <div className="text-sm text-muted-foreground">
                          2 days ago
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 5
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2">
                    Absolutely delicious! The recipe was easy to follow and the
                    result was amazing. My family loved it!
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="John Doe" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">John Doe</div>
                        <div className="text-sm text-muted-foreground">
                          1 week ago
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2">
                    Great recipe! I added a bit more cheese than recommended and
                    it turned out perfect for my taste.
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Recipe Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prep Time:</span>
                  <span>{recipe.prepTime} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cook Time:</span>
                  <span>{recipe.cookTime} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Time:</span>
                  <span>{recipe.prepTime + recipe.cookTime} mins</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servings:</span>
                  <span>{recipe.servings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cuisine:</span>
                  <span>{recipe.cuisine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span>{recipe.difficulty}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Related Recipes</h3>
              <div className="space-y-4">
                {recipe.relatedRecipes.map((related) => (
                  <Link
                    key={related.id}
                    href={`/recipes/${related.id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-3 group">
                      <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center shrink-0">
                        <div className="text-lg">🍝</div>
                      </div>
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {related.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {related.cuisine} • {related.prepTime} mins
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/5">
                  Italian
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Pasta
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Quick Meals
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Dinner
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Eggs
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Cheese
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
