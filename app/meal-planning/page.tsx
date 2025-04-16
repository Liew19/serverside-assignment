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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  Plus,
  Trash2
} from "lucide-react";
import Link from "next/link";
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meal Planning</h1>
          <p className="text-muted-foreground mt-1">
            Plan your meals for days or weeks ahead
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Plan
        </Button>
      </div>
      <Tabs defaultValue="calendar" className="mb-8">
        <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex md:space-x-0">
          <TabsTrigger value="calendar" className="flex-1 md:flex-initial">
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1 md:flex-initial">
            Saved Plans
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-6">
          <CalendarView />
        </TabsContent>
        {/* <TabsContent value="saved" className="mt-6">
          <SavedPlansView />
        </TabsContent> */}
      </Tabs>
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
  const { toast } = useToast();
  
  // For add meal dialog
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [isCustomMeal, setIsCustomMeal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState("");
  
  // For view/edit meal dialog
  const [isViewMealOpen, setIsViewMealOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Generate days for the current month
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

  // Fetch meals for the current month
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
      // Include credentials option for session cookies
      const response = await fetch(
        `http://localhost/server/php/meals/api/get_meals_for_month.php?year=${currentYear}&month=${
          currentDate.getMonth() + 1
        }&type=${mealTypeFilter}`,
        {
          method: 'GET',
          credentials: 'include', // Important for session cookies
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
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load meals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the add meal dialog
  const handleAddMeal = (day: number) => {
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

  // Handle submitting a new meal
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
      
      // Create meal object
      const newMeal = {
        date: selectedDate,
        name: isCustomMeal ? mealName : recipes.find(r => r.recipe_id === selectedRecipe)?.title || "",
        type: mealType,
        isCustom: isCustomMeal ? 1 : 0,  // Make sure this matches your PHP expectation (numeric)
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
      
      // Add the new meal to the meals array
      // Using the returned meal object from the API which should include the ID
      setMeals(prevMeals => [...prevMeals, responseData]);
      
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

  // Handle opening the view/edit meal dialog
  const handleViewMeals = (day: number) => {
    // Format the date (YYYY-MM-DD)
    const formattedDate = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Get meals for the selected day
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

  // Handle editing a meal
  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setMealName(meal.name);
    setMealType(meal.type);
    setIsCustomMeal(meal.isCustom);
    setSelectedRecipe(meal.recipeId || "");
    setIsEditing(true);
  };

  // Handle updating a meal
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
      
      // Create updated meal object
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
      
      // Update the local state
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

  // Handle deleting a meal
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
      
      // Update the local state
      setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
      
      toast({
        title: "Success",
        description: "Meal deleted successfully",
      });
      
      // If no more meals for the day, close the dialog
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

  const getMealsForDay = (day: number) => {
    // Format the date to compare with meal dates (YYYY-MM-DD)
    const formattedDate = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Filter meals that match the exact date (year, month and day)
    return meals.filter(meal => meal.date === formattedDate);
  };

  // Get color class based on meal type
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
              className="h-36 border rounded-lg bg-muted/20"
            ></div>
          ))}
          {days.map((day) => {
            const dayMeals = getMealsForDay(day);
            const hasReachedMealLimit = dayMeals.length >= 4;
            const formattedDate = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = formattedDate === new Date().toISOString().split('T')[0];
            
            return (
              <div
                key={day}
                className={`h-36 border rounded-lg p-2 group hover:border-primary transition-colors cursor-pointer ${isToday ? 'border-primary border-2' : ''}`}
                onClick={() => handleViewMeals(day)}
              >
                <div className={`font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                  {day}
                  {isToday && <span className="ml-1 text-xs text-primary">(Today)</span>}
                </div>
                
                <div className="space-y-1 max-h-[80px] overflow-y-auto">
                  {dayMeals.slice(0, 4).map((meal) => (
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
                {getMealsForDay(selectedDay || 0).length < 4 && (
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
    </div>
  );
}

// function SavedPlansView() {
//   const savedPlans = [
//     {
//       id: "1",
//       title: "Weekly Family Dinner Plan",
//       description: "A balanced meal plan for a family of four",
//       date: "Created on Apr 15, 2023",
//       meals: 21,
//       tags: ["Family", "Balanced"],
//     },
//     {
//       id: "2",
//       title: "Low Carb Week",
//       description: "Keto-friendly meals for weight management",
//       date: "Created on Mar 22, 2023",
//       meals: 15,
//       tags: ["Keto", "Low Carb"],
//     },
//     {
//       id: "3",
//       title: "Vegetarian Challenge",
//       description: "One week of delicious meat-free recipes",
//       date: "Created on Feb 10, 2023",
//       meals: 18,
//       tags: ["Vegetarian", "Healthy"],
//     },
//   ];

//   return (
//     <div>
//       <div className="flex mb-6">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search saved plans..."
//             className="pl-8"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {savedPlans.map((plan) => (
//           <Card key={plan.id} className="hover:shadow-md transition-shadow">
//             <CardHeader>
//               <CardTitle>{plan.title}</CardTitle>
//               <CardDescription>{plan.description}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="text-sm text-muted-foreground">{plan.date}</div>
//               <div className="text-sm mt-1">{plan.meals} meals planned</div>
//               <div className="flex gap-2 mt-3">
//                 {plan.tags.map((tag) => (
//                   <Badge key={tag} variant="outline" className="bg-primary/10">
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" size="sm">
//                 Edit
//               </Button>
//               <Button size="sm">Use Plan</Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
