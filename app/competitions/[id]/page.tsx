import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Share2,
  ThumbsUp,
  Trophy,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function CompetitionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real app, you would fetch the competition data based on the ID
  const competition = {
    id: params.id,
    title: "Summer Grilling Championship",
    description:
      "Show off your best grilling recipes in our summer championship! Create an original grilled dish that showcases seasonal ingredients and your unique cooking style.",
    longDescription:
      "Summer is the perfect time to fire up the grill and showcase your culinary creativity! In this exciting competition, we're looking for original grilled dishes that highlight the best seasonal ingredients while demonstrating your unique cooking style.\n\nWhether you specialize in meats, seafood, vegetables, or even fruits, this is your chance to impress our panel of judges with your grilling expertise. Entries will be judged on originality, presentation, use of seasonal ingredients, and overall execution.",
    status: "active",
    timeRemaining: "5 days",
    startDate: "May 1, 2023",
    endDate: "May 15, 2023",
    participants: 42,
    prize: "$500",
    sponsor: "GrillMaster Pro",
    rules: [
      "All recipes must include at least one grilled element",
      "Entries must be original creations (not published elsewhere)",
      "Seasonal ingredients must be prominently featured",
      "Submissions must include a high-quality photo of the finished dish",
      "Recipe must include a complete ingredient list and step-by-step instructions",
      "Participants may submit up to 2 different recipes",
    ],
    judges: [
      {
        name: "Chef Michael Rodriguez",
        avatar: "/placeholder.svg",
        bio: "Award-winning grill master and cookbook author",
      },
      {
        name: "Sarah Chen",
        avatar: "/placeholder.svg",
        bio: "Food critic and culinary instructor",
      },
      {
        name: "James Wilson",
        avatar: "/placeholder.svg",
        bio: "Executive chef at Flame Steakhouse",
      },
    ],
    entries: [
      {
        id: "1",
        title: "Grilled Peach & Burrata Salad",
        author: "CookingQueen",
        avatar: "/placeholder.svg",
        date: "3 days ago",
        votes: 28,
        comments: 12,
      },
      {
        id: "2",
        title: "Smoky Cedar Plank Salmon",
        author: "SeafoodLover",
        avatar: "/placeholder.svg",
        date: "4 days ago",
        votes: 35,
        comments: 8,
      },
      {
        id: "3",
        title: "Spicy Grilled Corn Elote",
        author: "SpiceKing",
        avatar: "/placeholder.svg",
        date: "5 days ago",
        votes: 42,
        comments: 15,
      },
      {
        id: "4",
        title: "Grilled Vegetable Skewers with Chimichurri",
        author: "VeggieChef",
        avatar: "/placeholder.svg",
        date: "2 days ago",
        votes: 19,
        comments: 7,
      },
      {
        id: "5",
        title: "Honey Lime Grilled Chicken",
        author: "You",
        avatar: "/placeholder.svg",
        date: "1 day ago",
        votes: 23,
        comments: 9,
        isYours: true,
      },
    ],
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/competitions">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Competitions
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
              <Trophy className="h-24 w-24 text-primary" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {competition.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-green-100">
                      Active
                    </Badge>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {competition.startDate} - {competition.endDate}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-primary">
                  {competition.prize} Prize
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 whitespace-pre-line">
                {competition.longDescription}
              </p>

              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{competition.participants} participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Ends in {competition.timeRemaining}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Submission Phase</span>
                  <span>{competition.participants}/100 entries</span>
                </div>
                <Progress value={competition.participants} className="h-2" />
              </div>

              <div className="flex justify-between">
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button>Submit Your Entry</Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="entries" className="mt-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="entries">Entries</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="judges">Judges</TabsTrigger>
            </TabsList>

            <TabsContent value="entries" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Competition Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competition.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="border rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={entry.avatar}
                                alt={entry.author}
                              />
                              <AvatarFallback>
                                {entry.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{entry.title}</div>
                              <div className="text-sm text-muted-foreground">
                                by {entry.author} • {entry.date}
                              </div>
                            </div>
                            {entry.isYours && (
                              <Badge
                                variant="outline"
                                className="ml-2 bg-primary/10"
                              >
                                Your Entry
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="mr-1 h-4 w-4" />
                              {entry.votes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              {entry.comments}
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Competition Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5">
                    {competition.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="font-medium mb-2">Judging Criteria</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Originality and creativity</span>
                          <span>25%</span>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Presentation and visual appeal</span>
                          <span>25%</span>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Use of seasonal ingredients</span>
                          <span>25%</span>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Recipe clarity and execution</span>
                          <span>25%</span>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="judges" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meet the Judges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {competition.judges.map((judge, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary transition-colors"
                      >
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={judge.avatar} alt={judge.name} />
                          <AvatarFallback>
                            {judge.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-lg">
                            {judge.name}
                          </div>
                          <div className="text-muted-foreground">
                            {judge.bio}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>Competition Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div>
                <div className="text-sm font-medium">Sponsor</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-3 w-3 text-primary" />
                  </div>
                  {competition.sponsor}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Prize</div>
                <div className="text-xl font-bold text-primary mt-1">
                  {competition.prize}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Timeline</div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Submission Start</span>
                    <span>{competition.startDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Submission End</span>
                    <span>{competition.endDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Voting Period</span>
                    <span>May 16-20, 2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Winners Announced</span>
                    <span>May 22, 2023</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium">Top Entries</div>
                <div className="space-y-2 mt-2">
                  {competition.entries
                    .sort((a, b) => b.votes - a.votes)
                    .slice(0, 3)
                    .map((entry, index) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 truncate">{entry.title}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          {entry.votes}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <Separator />

              <Button variant="outline" className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Save to Favorites
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>Similar Competitions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="border rounded-lg p-3 hover:border-primary transition-colors">
                <div className="font-medium">Backyard BBQ Battle</div>
                <div className="text-sm text-muted-foreground mb-2">
                  Ends in 2 weeks
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  View
                </Button>
              </div>

              <div className="border rounded-lg p-3 hover:border-primary transition-colors">
                <div className="font-medium">Farm-to-Table Challenge</div>
                <div className="text-sm text-muted-foreground mb-2">
                  Starts in 3 days
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  View
                </Button>
              </div>

              <div className="border rounded-lg p-3 hover:border-primary transition-colors">
                <div className="font-medium">Seafood Spectacular</div>
                <div className="text-sm text-muted-foreground mb-2">
                  Ends in 1 week
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
