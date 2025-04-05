import type React from "react";
import {
  MessageSquare,
  Search,
  ThumbsUp,
  Users,
  Filter,
  Bell,
  ArrowLeft,
} from "lucide-react";
import NextLink from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function CommunityPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" className="mb-6" asChild>
        <NextLink href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </NextLink>
      </Button>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground mt-1">
            Connect with other cooking enthusiasts
          </p>
        </div>
        <Button>Start a Discussion</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search discussions..."
                className="w-full pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>

          <Tabs defaultValue="recent" className="mb-6">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 md:flex md:space-x-0">
              <TabsTrigger value="recent" className="flex-1 md:flex-initial">
                Recent
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex-1 md:flex-initial">
                Popular
              </TabsTrigger>
              <TabsTrigger
                value="unanswered"
                className="flex-1 md:flex-initial"
              >
                Unanswered
              </TabsTrigger>
              <TabsTrigger value="my-posts" className="flex-1 md:flex-initial">
                My Posts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="mt-6">
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <DiscussionCard key={discussion.id} discussion={discussion} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="popular" className="mt-6">
              <div className="space-y-4">
                {discussions
                  .sort((a, b) => b.likes - a.likes)
                  .map((discussion) => (
                    <DiscussionCard
                      key={discussion.id}
                      discussion={discussion}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="unanswered" className="mt-6">
              <div className="space-y-4">
                {discussions
                  .filter((d) => d.comments === 0)
                  .map((discussion) => (
                    <DiscussionCard
                      key={discussion.id}
                      discussion={discussion}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="my-posts" className="mt-6">
              <div className="space-y-4">
                {discussions
                  .filter((d) => d.author.name === "You")
                  .map((discussion) => (
                    <DiscussionCard
                      key={discussion.id}
                      discussion={discussion}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <Button variant="outline">Load More</Button>
          </div>
        </div>

        <div className="md:w-1/4">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Bell className="mr-2 h-4 w-4" /> Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                <div className="border-l-2 border-primary pl-3 py-1">
                  <p className="font-medium text-sm">New Recipe Contest</p>
                  <p className="text-xs text-muted-foreground">
                    Starting next week
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-3 py-1">
                  <p className="font-medium text-sm">
                    Community Guidelines Updated
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please review the changes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">8,432</div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">12,543</div>
                  <div className="text-sm text-muted-foreground">
                    Discussions
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">45,987</div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Guidelines
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Top Contributors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {topContributors.map((contributor) => (
                <div key={contributor.id} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage
                      src={contributor.avatar}
                      alt={contributor.name}
                    />
                    <AvatarFallback>
                      {contributor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{contributor.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {contributor.posts} posts
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/10">
                    {contributor.level}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  likes: number;
  comments: number;
  views: number;
  isHot?: boolean;
}

function DiscussionCard({ discussion }: { discussion: Discussion }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg hover:text-primary transition-colors">
              <NextLink href={`/community/discussions/${discussion.id}`}>
                {discussion.title}
              </NextLink>
              {discussion.isHot && (
                <Badge className="ml-2 bg-rose-500 text-white">Hot</Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={discussion.author.avatar}
                    alt={discussion.author.name}
                  />
                  <AvatarFallback>
                    {discussion.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{discussion.author.name}</span>
                <span>•</span>
                <span>{discussion.date}</span>
              </div>
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <ThumbsUp className="mr-1 h-4 w-4" />
              {discussion.likes}
            </div>
            <div className="flex items-center">
              <MessageSquare className="mr-1 h-4 w-4" />
              {discussion.comments}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-muted-foreground">
          {discussion.content}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {discussion.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-primary/5">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm">
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper component for links
function Link({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

// Sample data
const discussions: Discussion[] = [
  {
    id: "1",
    title: "What's your favorite way to cook pasta?",
    content:
      "I've been trying different methods for cooking pasta and I'm curious what others do. Do you add salt to the water? Oil? Do you rinse after cooking?",
    tags: ["pasta", "cooking-methods", "tips"],
    author: {
      name: "PastaLover",
      avatar: "/placeholder.svg",
    },
    date: "2 hours ago",
    likes: 24,
    comments: 15,
    views: 142,
    isHot: true,
  },
  {
    id: "2",
    title: "Help with sourdough starter",
    content:
      "My sourdough starter isn't rising as much as it should. It's been 5 days since I created it and I'm feeding it regularly. Any tips on what might be wrong?",
    tags: ["sourdough", "baking", "help"],
    author: {
      name: "BreadBaker",
      avatar: "/placeholder.svg",
    },
    date: "1 day ago",
    likes: 18,
    comments: 22,
    views: 203,
  },
  {
    id: "3",
    title: "Share your best kitchen hack!",
    content:
      "I'll start: freeze herbs in olive oil ice cube trays for easy cooking later. What's your best time-saving or flavor-enhancing kitchen hack?",
    tags: ["kitchen-hacks", "tips", "discussion"],
    author: {
      name: "You",
      avatar: "/placeholder.svg",
    },
    date: "3 days ago",
    likes: 56,
    comments: 42,
    views: 512,
  },
  {
    id: "4",
    title: "Vegetarian substitutes for meat in recipes?",
    content:
      "I'm trying to reduce my meat consumption and looking for good vegetarian substitutes that work well in traditional meat recipes. Any suggestions?",
    tags: ["vegetarian", "substitutes", "recipes"],
    author: {
      name: "GreenEater",
      avatar: "/placeholder.svg",
    },
    date: "5 days ago",
    likes: 32,
    comments: 28,
    views: 345,
  },
  {
    id: "5",
    title: "How to properly sharpen kitchen knives?",
    content:
      "I've been using a honing rod but I think my knives need actual sharpening. What's the best method for home cooks?",
    tags: ["knives", "kitchen-tools", "maintenance"],
    author: {
      name: "SharpCook",
      avatar: "/placeholder.svg",
    },
    date: "1 week ago",
    likes: 41,
    comments: 0,
    views: 267,
  },
];

const topContributors = [
  {
    id: "1",
    name: "ChefMaster",
    avatar: "/placeholder.svg",
    posts: 342,
    level: "Expert",
  },
  {
    id: "2",
    name: "BakingQueen",
    avatar: "/placeholder.svg",
    posts: 256,
    level: "Pro",
  },
  {
    id: "3",
    name: "FoodScientist",
    avatar: "/placeholder.svg",
    posts: 189,
    level: "Pro",
  },
  {
    id: "4",
    name: "HomeCook",
    avatar: "/placeholder.svg",
    posts: 127,
    level: "Regular",
  },
];
