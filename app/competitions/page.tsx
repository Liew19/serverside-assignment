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

function getCookie(name: string): string | null {
  if (typeof document === 'undefined' || !document.cookie) return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift()!;
  return null;
}
const user_id = getCookie('user_id'); 

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [admin, setAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 2. Check status
        if (!user_id) {
          console.warn("No user_id found in cookie or state.");
          router.push("/");
          return;
        }
        const statusRes = await fetch(`http://localhost/server/php/competition/api/user.php`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            action: "check_status",
            user_id: user_id.toString()
          }).toString(),
        });
        console.log("status response", statusRes);
        const status = await statusRes.json();
        if (status.status == 'fake cookie') {
          console.log("fake cookie");
          router.push("/logout");
          return;
        }
  
        if (status.status === true) {
          setAdmin(status.admin === true);
          console.log(status.admin ? "you are admin" : "you are not admin");
        } else {
          setAdmin(false);
        }

        // then Fetch competitions
        const compRes = await fetch(`http://localhost/server/php/competition/api/user.php?action=get_all_competitions`, {
          credentials: "include",
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        const compData = await compRes.json();
        console.log("Fetched competitions:", compData);
        setCompetitions(compData.data);
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };
  
    fetchData();
  }, [user_id]);
  


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
        {admin && (
          <Button asChild>
            <Link href="/competitions/create">Create Competition</Link>
          </Button>
        )}
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
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-5">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            <Link
              href={`/competitions/${competition.competition_id}?user_id=${user_id}`}
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