import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function MealPlanningPage() {
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
          <TabsTrigger value="weekly" className="flex-1 md:flex-initial">
            Weekly Plan
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1 md:flex-initial">
            Saved Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <CalendarView />
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <WeeklyPlanView />
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <SavedPlansView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CalendarView() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {currentMonth} {currentYear}
          </h2>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter meals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meals</SelectItem>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snacks">Snacks</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium py-2 text-sm">
            {day}
          </div>
        ))}

        {emptyDays.map((_, index) => (
          <div
            key={`empty-${index}`}
            className="h-32 border rounded-lg bg-muted/20"
          ></div>
        ))}

        {days.map((day) => (
          <div
            key={day}
            className="h-32 border rounded-lg p-2 hover:border-primary transition-colors"
          >
            <div className="font-medium mb-1">{day}</div>
            {day === 15 && (
              <div className="mt-1 p-1 bg-primary/10 text-primary text-xs rounded flex items-center">
                <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>
                <span className="truncate">Spaghetti Carbonara</span>
              </div>
            )}
            {day === 16 && (
              <div className="mt-1 p-1 bg-primary/10 text-primary text-xs rounded flex items-center">
                <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>
                <span className="truncate">Chicken Tikka Masala</span>
              </div>
            )}
            {day === 20 && (
              <div className="mt-1 p-1 bg-primary/10 text-primary text-xs rounded flex items-center">
                <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>
                <span className="truncate">Greek Salad</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-1 h-6 text-xs justify-start opacity-0 hover:opacity-100 transition-opacity"
            >
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyPlanView() {
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">Week of May 1 - May 7, 2023</h2>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button>
            <CalendarIcon className="mr-2 h-4 w-4" /> Generate Plan
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-muted/50 w-24"></th>
              {weekdays.map((day) => (
                <th key={day} className="border p-2 bg-muted/50">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealTypes.map((mealType) => (
              <tr key={mealType}>
                <td className="border p-2 font-medium bg-muted/20">
                  {mealType}
                </td>
                {weekdays.map((day) => (
                  <td
                    key={`${mealType}-${day}`}
                    className="border p-2 h-24 align-top hover:bg-muted/10 transition-colors"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-auto text-left text-muted-foreground"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add meal
                    </Button>
                    {mealType === "Dinner" && day === "Monday" && (
                      <div className="mt-1 p-1 bg-primary/10 text-primary text-xs rounded">
                        Spaghetti Carbonara
                      </div>
                    )}
                    {mealType === "Lunch" && day === "Wednesday" && (
                      <div className="mt-1 p-1 bg-primary/10 text-primary text-xs rounded">
                        Greek Salad
                      </div>
                    )}
                    {mealType === "Dinner" && day === "Friday" && (
                      <div className="mt-1 p-1 bg-primary/10 text-primary text-xs rounded">
                        Chicken Tikka Masala
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Export Plan</Button>
        <Button>Save Plan</Button>
      </div>
    </div>
  );
}

function SavedPlansView() {
  const savedPlans = [
    {
      id: "1",
      title: "Weekly Family Dinner Plan",
      description: "A balanced meal plan for a family of four",
      date: "Created on Apr 15, 2023",
      meals: 21,
      tags: ["Family", "Balanced"],
    },
    {
      id: "2",
      title: "Low Carb Week",
      description: "Keto-friendly meals for weight management",
      date: "Created on Mar 22, 2023",
      meals: 15,
      tags: ["Keto", "Low Carb"],
    },
    {
      id: "3",
      title: "Vegetarian Challenge",
      description: "One week of delicious meat-free recipes",
      date: "Created on Feb 10, 2023",
      meals: 18,
      tags: ["Vegetarian", "Healthy"],
    },
  ];

  return (
    <div>
      <div className="flex mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search saved plans..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedPlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{plan.date}</div>
              <div className="text-sm mt-1">{plan.meals} meals planned</div>
              <div className="flex gap-2 mt-3">
                {plan.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-primary/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button size="sm">Use Plan</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
