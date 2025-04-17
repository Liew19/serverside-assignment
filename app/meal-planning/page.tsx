"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit,
  LogIn,
  Navigation,
  Plus,
  Trash2,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  isCustom: boolean;
  recipeId?: string | null;
  date: string;
}

interface Recipe {
  recipe_id: string;
  title: string;
}

export default function MealPlanningPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home Page
        </Link>
      </Button>
      <div className="flex flex-col justify-start items-start gap-4 mb-8">
        <h1 className="text-3xl font-bold">Meal Planning</h1>
        <p className="text-muted-foreground mt-1">
          Plan your meals for days or weeks ahead
        </p>
      </div>
      <CalendarView />
    </div>
  );
}

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  
  const [meals, setMeals] = useState<Meal[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [mealTypeFilter, setMealTypeFilter] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [isCustomMeal, setIsCustomMeal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState("");
  
  const [isViewMealOpen, setIsViewMealOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const daysInMonth = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentYear,
    currentDate.getMonth(),
    1
  ).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  useEffect(() => {
    checkUserLoginStatus();
  }, []);

  const checkUserLoginStatus = () => {
    // Check if user_id cookie exists
    const cookies = document.cookie.split(';');
    const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('user_id='));
    
    if (userIdCookie) {
      const userId = userIdCookie.split('=')[1];
      if (userId && userId !== "guest") {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  // Navigation functions
  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    fetchMealsForMonth();
  }, [currentDate, mealTypeFilter]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`http://localhost/server/php/meals/api/get_user_recipes.php`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        title: "Error",
        description: "Failed to load recipes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchMealsForMonth = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost/server/php/meals/api/get_meals_for_month.php?year=${currentYear}&month=${currentDate.getMonth() + 1}&type=${mealTypeFilter}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch meals: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMeals(data);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = (day: number) => {
    if (!isLoggedIn) {
      setIsAuthDialogOpen(true);
      return;
    }
    // Format the date (YYYY-MM-DD)
    const formattedDate = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    setSelectedDay(day);
    setSelectedDate(formattedDate);
    setMealName("");
    setMealType("breakfast");
    setIsCustomMeal(false);
    setSelectedRecipe("");
    setIsAddMealOpen(true);
  };
  
  const handleSubmitMeal = async () => {
    try {
      // Validation
      if (isCustomMeal && !mealName) {
        toast({
          title: "Error",
          description: "Please enter a meal name",
          variant: "destructive",
        });
        return;
      }
      
      if (!isCustomMeal && !selectedRecipe) {
        toast({
          title: "Error",
          description: "Please select a recipe",
          variant: "destructive",
        });
        return;
      }
      
      const newMeal = {
        date: selectedDate,
        name: isCustomMeal ? mealName : recipes.find(r => r.recipe_id === selectedRecipe)?.title || "",
        type: mealType,
        isCustom: isCustomMeal ? 1 : 0,
        recipeId: isCustomMeal ? null : selectedRecipe
      };
      
      const response = await fetch('http://localhost/server/php/meals/api/add_meals.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMeal),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add meal: ${errorText}`);
      }
      
      const responseData = await response.json();
      
      if (responseData.error) {
        throw new Error(responseData.error);
      }
      
      setMeals(prevMeals => [...prevMeals, {
        ...responseData,
        isCustom: responseData.isCustom === 1 || responseData.isCustom === true
      }]);
      
      toast({
        title: "Success",
        description: "Meal added successfully",
      });
      
      setIsAddMealOpen(false);
    } catch (error) {
      console.error("Error adding meal:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewMeals = (day: number) => {
    // Format the date (YYYY-MM-DD)
    const formattedDate = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const mealsForDay = getMealsForDay(day);
    
    if (mealsForDay.length > 0) {
      setSelectedDay(day);
      setSelectedDate(formattedDate);
      setIsViewMealOpen(true);
    } else {
      // If no meals, open the add meal dialog
      handleAddMeal(day);
    }
  };

  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setMealName(meal.name);
    setMealType(meal.type);
    setIsCustomMeal(meal.isCustom);
    setSelectedRecipe(meal.recipeId || "");
    setIsEditing(true);
  };

  const handleUpdateMeal = async () => {
    if (!selectedMeal) return;
    
    try {
      // Validation
      if (isCustomMeal && !mealName) {
        toast({
          title: "Error",
          description: "Please enter a meal name",
          variant: "destructive",
        });
        return;
      }
      
      if (!isCustomMeal && !selectedRecipe) {
        toast({
          title: "Error",
          description: "Please select a recipe",
          variant: "destructive",
        });
        return;
      }

      const updatedMeal = {
        id: selectedMeal.id,
        name: isCustomMeal ? mealName : recipes.find(r => r.recipe_id === selectedRecipe)?.title || "",
        type: mealType,
        isCustom: isCustomMeal,
        recipeId: isCustomMeal ? null : selectedRecipe
      };
      
      console.log('Sending update request with data:', updatedMeal);
      
      const response = await fetch('http://localhost/server/php/meals/api/update_meal.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updatedMeal, _method: 'PUT' }),
      });
      
      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Failed to parse JSON response: ${responseText}`);
      }
      
      if (!response.ok || responseData.error) {
        throw new Error(responseData.error || 'Failed to update meal');
      }
      
      setMeals(prevMeals => 
        prevMeals.map(meal => 
          meal.id === selectedMeal.id ? {...meal, ...updatedMeal} : meal
        )
      );
      
      toast({
        title: "Success",
        description: "Meal updated successfully",
      });
      
      setIsEditing(false);
      setSelectedMeal(null);
    } catch (error) {
      console.error("Error updating meal:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      const response = await fetch('http://localhost/server/php/meals/api/delete_meal.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: mealId, _method: 'DELETE' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete meal');
      }
      
      const responseData = await response.json();
      
      if (responseData.error) {
        throw new Error(responseData.error);
      }
      
      setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
      
      toast({
        title: "Success",
        description: "Meal deleted successfully",
      });
      
      const remainingMealsForDay = meals.filter(meal => 
        meal.date === selectedDate && meal.id !== mealId
      );
      
      if (remainingMealsForDay.length === 0) {
        setIsViewMealOpen(false);
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast({
        title: "Error",
        description: "Failed to delete meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sortMealsByType = (meals: Meal[]) => {
    const mealTypeOrder = {
      breakfast: 1,
      lunch: 2,
      dinner: 3,
      snack: 4
    };
    
    return meals.sort((a, b) => mealTypeOrder[a.type] - mealTypeOrder[b.type]);
  };


  const getMealsForDay = (day: number) => {
    const formattedDate = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const mealsForDay = meals.filter(meal => meal.date === formattedDate);
    // Return sorted meals
    return sortMealsByType(mealsForDay);
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-blue-100 text-blue-800';
      case 'lunch':
        return 'bg-green-100 text-green-800';
      case 'dinner':
        return 'bg-purple-100 text-purple-800';
      case 'snack':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {currentMonth} {currentYear}
          </h2>
          <Button 
            variant="outline" 
            size="icon"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select 
            value={mealTypeFilter} 
            onValueChange={setMealTypeFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter meals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">All Meals</SelectItem>
              <SelectItem value="breakfast" className="cursor-pointer">Breakfast</SelectItem>
              <SelectItem value="lunch" className="cursor-pointer">Lunch</SelectItem>
              <SelectItem value="dinner" className="cursor-pointer">Dinner</SelectItem>
              <SelectItem value="snack" className="cursor-pointer">Snacks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading meal plan...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-medium py-2 text-sm">
              {day}
            </div>
          ))}
          {emptyDays.map((_, index) => (
            <div
              key={`empty-${index}`}
              className="h-40 border rounded-lg bg-muted/20"
            ></div>
          ))}
          {days.map((day) => {
            const dayMeals = getMealsForDay(day);
            const hasReachedMealLimit = dayMeals.length >= 6;
            const formattedDate = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = formattedDate === new Date().toISOString().split('T')[0];
            
            return (
              <div
                key={day}
                className={`h-40 border rounded-lg p-2 group hover:border-primary transition-colors cursor-pointer ${isToday ? 'border-primary border-2' : ''}`}
                onClick={() => handleViewMeals(day)}
              >
                <div className={`font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                  {day}
                  {isToday && <span className="ml-1 text-xs text-primary">(Today)</span>}
                </div>
                
                <div className="space-y-1 max-h-[80px] overflow-y-auto">
                  {dayMeals.slice(0, 6).map((meal) => (
                    <div 
                      key={meal.id} 
                      className={`p-1 text-xs rounded flex items-center ${getMealTypeColor(meal.type)}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current mr-1"></span>
                      <span className="truncate">{meal.name}</span>
                    </div>
                  ))}
                </div>
                
                {!hasReachedMealLimit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-1 h-6 text-xs justify-start opacity-0 group-hover:opacity-100 group-hover:bg-slate-200 transition-opacity duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddMeal(day);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Meal Dialog */}
      <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Add Meal for {currentMonth} {selectedDay}, {currentYear}
            </DialogTitle>
            <DialogDescription>
              Plan your meal by selecting a saved recipe or adding a custom meal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select 
                value={mealType} 
                onValueChange={(value: "breakfast" | "lunch" | "dinner" | "snack") => setMealType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="meal-source">Meal Source</Label>
                <Select 
                  value={isCustomMeal ? "custom" : "recipe"} 
                  onValueChange={(value) => setIsCustomMeal(value === "custom")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recipe">Saved Recipe</SelectItem>
                    <SelectItem value="custom">Custom Meal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isCustomMeal ? (
              <div className="grid gap-2">
                <Label htmlFor="custom-meal">Custom Meal Name</Label>
                <Input
                  id="custom-meal"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="Enter meal name"
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="recipe">Select Recipe</Label>
                <Select 
                  value={selectedRecipe} 
                  onValueChange={setSelectedRecipe}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipes.map(recipe => (
                      <SelectItem key={recipe.recipe_id} value={recipe.recipe_id}>
                        {recipe.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={handleSubmitMeal}>
              Add Meal
            </Button>
            <Button variant="outline" onClick={() => setIsAddMealOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Meals Dialog */}
      <Dialog open={isViewMealOpen} onOpenChange={setIsViewMealOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Meals for {currentMonth} {selectedDay}, {currentYear}
            </DialogTitle>
            <DialogDescription>
              View, edit or delete your planned meals for this day.
            </DialogDescription>
          </DialogHeader>
          
          {isEditing && selectedMeal ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-meal-type">Meal Type</Label>
                <Select 
                  value={mealType} 
                  onValueChange={(value: "breakfast" | "lunch" | "dinner" | "snack") => setMealType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="edit-meal-source">Meal Source</Label>
                  <Select 
                    value={isCustomMeal ? "custom" : "recipe"} 
                    onValueChange={(value) => setIsCustomMeal(value === "custom")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recipe">Saved Recipe</SelectItem>
                      <SelectItem value="custom">Custom Meal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isCustomMeal ? (
                <div className="grid gap-2">
                  <Label htmlFor="edit-custom-meal">Custom Meal Name</Label>
                  <Input
                    id="edit-custom-meal"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    placeholder="Enter meal name"
                  />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="edit-recipe">Select Recipe</Label>
                  <Select 
                    value={selectedRecipe} 
                    onValueChange={setSelectedRecipe}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipes.map(recipe => (
                        <SelectItem key={recipe.recipe_id} value={recipe.recipe_id}>
                          {recipe.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <DialogFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      Update Meal
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure to update?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will update the meal details. Are you sure you want to proceed?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction onClick={handleUpdateMeal}>
                        Yes
                      </AlertDialogAction>
                      <AlertDialogCancel>No</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setSelectedMeal(null);
                }}>
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="py-4">
                {selectedDate && getMealsForDay(selectedDay || 0).length > 0 ? (
                  <div className="space-y-4">
                    {getMealsForDay(selectedDay || 0).map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {meal.type} • {meal.isCustom ? "Custom Meal" : "Recipe"}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {meal.isCustom ? (null) : (
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => router.push(`/recipes/${meal.recipeId}`)}
                            >
                              <Navigation className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEditMeal(meal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="icon"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure to delete?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogAction onClick={() => handleDeleteMeal(meal.id)}>
                                  Yes
                                </AlertDialogAction>
                                <AlertDialogCancel>No</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No meals planned for this day.
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex justify-between">
                {getMealsForDay(selectedDay || 0).length < 6 && (
                  <Button onClick={() => {
                    setIsViewMealOpen(false);
                    handleAddMeal(selectedDay || 0);
                  }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Meal
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsViewMealOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle className="my-2">Login Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to plan meals and manage your meal calendar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4 mt-5">
          <Button asChild className="w-full">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Have an account? Login here
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/register">
              <UserPlus className="mr-2 h-4 w-4" />
              New user? Register here
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
};