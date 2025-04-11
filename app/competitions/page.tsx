'use client';

import Link from "next/link";
import React, { useState, useEffect } from 'react';
import {useRouter} from "next/navigation";
import {
  Calendar,
  Clock,
  Filter,
  Search,
  Trophy,
  Users,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface Competition {
  competition_id: string;
  title: string;
  description: string;
  status: "upcoming" | "active" | "past";
  start_date?: string;
  end_date?: string;
  prize?: string;
  image?: string;
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    const url = `http://localhost/Recipe/api/api.php?action=get_all_competitions`;
    fetch(url, {
      method: 'GET',  // Make sure you're sending the correct request method
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwidXNlcm5hbWUiOiJPR0MiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDM2Njk4MTgsImV4cCI6MTc0MzY3MzQxOH0=.bA8E4AoRTloJN5SK72CBCAOnKQk7pYF+U3gxdfuufF8=`,
        'Content-Type': 'application/x-www-form-urlencoded',  // Ensure the content type is set if needed
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched competitions:", data);
        setCompetitions(data.data);
      })
      .catch((error) => console.error('Error fetching competitions:', error));
  }, []);


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
          <h1 className="text-3xl font-bold">Cooking Competitions</h1>
          <p className="text-muted-foreground mt-1">
            Showcase your skills and win recognition
          </p>
        </div>
        <Button asChild>
          <Link href="/competitions/create">Create Competition</Link> 
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search competitions..."
            className="w-full pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      <Tabs defaultValue="active" className="mb-8"> 
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 md:flex md:space-x-0">
          <TabsTrigger value="active" className="flex-1 md:flex-initial">
            Active
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1 md:flex-initial">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1 md:flex-initial">
            Past
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions
              .filter((comp) => comp.status === "active" )
              .map((competition) => (
                <CompetitionCard
                  key={competition.competition_id}
                  competition={competition}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions
              .filter((comp) => comp.status === "upcoming")
              .map((competition) => (
                <CompetitionCard
                  key={competition.competition_id}
                  competition={competition}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions
              .filter((comp) => comp.status === "past")
              .map((competition) => (
                <CompetitionCard
                  key={competition.competition_id}
                  competition={competition}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


function CompetitionCard({ competition }: { competition: Competition }) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-primary/10 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Trophy className="h-12 w-12 text-primary/40" />
        </div>
        {competition.prize && (
          <div className="absolute top-3 right-3">
            <div className="bg-background/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
              {competition.prize} Prize
            </div>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
          <Link
            href={`/competitions/${competition.competition_id}`}
            className="hover:text-primary transition-colors"
          >
              {competition.title}
            </Link>
          </CardTitle>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            variant="outline"
            className={
              competition.status === "active"
                ? "bg-green-100"
                : competition.status === "upcoming"
                ? "bg-blue-100"
                : "bg-gray-100"
            }
          >
            {competition.status === "active"
              ? "Active"
              : competition.status === "upcoming"
              ? "Upcoming"
              : "Completed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground line-clamp-2 text-sm mb-4">
          {competition.description}
        </p>
        <div className="flex flex-col gap-2 text-sm">

          {competition.status === "active" && (
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Ends on {competition.end_date}</span>
            </div>
          )}

          {competition.status === "upcoming" && competition.start_date && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Starts on {competition.start_date}</span>
            </div>
          )}

          {competition.status === "past" && competition.end_date && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Ended on {competition.end_date}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// // Sample data
// const competitions: Competition[] = [
//   {
//     id: "1",
//     title: "Summer Grilling Championship",
//     description:
//       "Show off your best grilling recipes in our summer championship! Create an original grilled dish that showcases seasonal ingredients.",
//     status: "active",
//     prize: "$500",
//   },
//   {
//     id: "2",
//     title: "Baking Bonanza",
//     description:
//       "Calling all bakers! Show us your most impressive cake, bread, or pastry creation in this exciting baking competition.",
//     status: "active",
//     prize: "$250",
//   },
//   {
//     id: "3",
//     title: "Healthy Meal Challenge",
//     description:
//       "Create a nutritious and delicious meal under 500 calories that doesn't sacrifice flavor.",
//     status: "upcoming",
//     startDate: "June 15, 2023",
//     prize: "$300",
//   },
//   {
//     id: "4",
//     title: "International Cuisine Showdown",
//     description:
//       "Prepare an authentic dish from a country other than your own. Judging based on authenticity, presentation, and taste.",
//     status: "upcoming",
//     startDate: "July 1, 2023",
//     prize: "$400",
//   },
//   {
//     id: "5",
//     title: "Spring Dessert Contest",
//     description:
//       "Our spring dessert competition featured light, refreshing treats perfect for the season.",
//     status: "past",
//     endDate: "April 30, 2023",
//     prize: "$350",
//   },
//   {
//     id: "6",
//     title: "Soup & Stew Championship",
//     description:
//       "Participants created hearty and flavorful soups and stews from around the world.",
//     status: "past",
//     endDate: "March 15, 2023",
//   },
// ];
