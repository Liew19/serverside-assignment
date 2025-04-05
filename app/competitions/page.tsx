import Link from "next/link";
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

export default function CompetitionsPage() {
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
          <TabsTrigger value="my-entries" className="flex-1 md:flex-initial">
            My Entries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions
              .filter((comp) => comp.status === "active")
              .map((competition) => (
                <CompetitionCard
                  key={competition.id}
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
                  key={competition.id}
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
                  key={competition.id}
                  competition={competition}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="my-entries" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions
              .filter((comp) => comp.hasEntered)
              .map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Competition</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/competitions">
              View All <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-primary/20 to-primary/5 p-6 flex items-center justify-center">
              <Trophy className="h-24 w-24 text-primary" />
            </div>
            <div className="md:w-2/3 p-6">
              <CardHeader className="p-0 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      Summer Grilling Championship
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-100">
                        Active
                      </Badge>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        Ends in 5 days
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        42 participants
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    $500 Prize
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 py-4">
                <p>
                  Show off your best grilling recipes in our summer
                  championship! Create an original grilled dish that showcases
                  seasonal ingredients and your unique cooking style.
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="bg-primary/5">
                    Grilling
                  </Badge>
                  <Badge variant="outline" className="bg-primary/5">
                    Summer
                  </Badge>
                  <Badge variant="outline" className="bg-primary/5">
                    Seasonal
                  </Badge>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Submission Phase</span>
                    <span>42/100 entries</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <Avatar className="border-2 border-background h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>U2</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>U3</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs">
                      +39
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Recent participants
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 pt-4 flex justify-between">
                <Button variant="outline">View Details</Button>
                <Button>Submit Entry</Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface Competition {
  id: string;
  title: string;
  description: string;
  status: "upcoming" | "active" | "past";
  timeRemaining?: string;
  startDate?: string;
  endDate?: string;
  participants: number;
  prize?: string;
  hasEntered?: boolean;
  image?: string;
}

function CompetitionCard({ competition }: { competition: Competition }) {
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
        {competition.hasEntered && (
          <div className="absolute top-3 left-3">
            <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              Entered
            </div>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            <Link
              href={`/competitions/${competition.id}`}
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
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{competition.participants} participants</span>
          </div>

          {competition.status === "active" && competition.timeRemaining && (
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Ends in {competition.timeRemaining}</span>
            </div>
          )}

          {competition.status === "upcoming" && competition.startDate && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Starts on {competition.startDate}</span>
            </div>
          )}

          {competition.status === "past" && competition.endDate && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Ended on {competition.endDate}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={`/competitions/${competition.id}`}>
            {competition.status === "active" &&
              !competition.hasEntered &&
              "Enter Competition"}
            {competition.status === "active" &&
              competition.hasEntered &&
              "View My Entry"}
            {competition.status === "upcoming" && "View Details"}
            {competition.status === "past" && "View Results"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Sample data
const competitions: Competition[] = [
  {
    id: "1",
    title: "Summer Grilling Championship",
    description:
      "Show off your best grilling recipes in our summer championship! Create an original grilled dish that showcases seasonal ingredients.",
    status: "active",
    timeRemaining: "5 days",
    participants: 42,
    prize: "$500",
    hasEntered: true,
  },
  {
    id: "2",
    title: "Baking Bonanza",
    description:
      "Calling all bakers! Show us your most impressive cake, bread, or pastry creation in this exciting baking competition.",
    status: "active",
    timeRemaining: "2 weeks",
    participants: 28,
    prize: "$250",
    hasEntered: false,
  },
  {
    id: "3",
    title: "Healthy Meal Challenge",
    description:
      "Create a nutritious and delicious meal under 500 calories that doesn't sacrifice flavor.",
    status: "upcoming",
    startDate: "June 15, 2023",
    participants: 15,
    prize: "$300",
    hasEntered: false,
  },
  {
    id: "4",
    title: "International Cuisine Showdown",
    description:
      "Prepare an authentic dish from a country other than your own. Judging based on authenticity, presentation, and taste.",
    status: "upcoming",
    startDate: "July 1, 2023",
    participants: 8,
    prize: "$400",
    hasEntered: false,
  },
  {
    id: "5",
    title: "Spring Dessert Contest",
    description:
      "Our spring dessert competition featured light, refreshing treats perfect for the season.",
    status: "past",
    endDate: "April 30, 2023",
    participants: 56,
    prize: "$350",
    hasEntered: true,
  },
  {
    id: "6",
    title: "Soup & Stew Championship",
    description:
      "Participants created hearty and flavorful soups and stews from around the world.",
    status: "past",
    endDate: "March 15, 2023",
    participants: 37,
    hasEntered: false,
  },
];
