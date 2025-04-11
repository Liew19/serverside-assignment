'use client';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// In Next.js App Router, page props contain the route parameters
export default function CompetitionDetailPage({
  params
}: {
  params: { id: string }
}) {
  const competitionId = params.id;
  
  interface Competition {
    competition_id: string;
    title: string;
    description: string;
    status: "active" | "upcoming" | "past";
    start_date: string;
    end_date: string;
    voting_end_date: string;
    entry_num: number;
    prize: number;
  }
  
  interface Entry {
    entry_id: string;
    title: string;
    description: string;
    username: string;
    submission_date: string;
    number_of_votes: number;
  }
  type Entries = Entry[];
  
  interface votedEntry{
    entry_id: string
  }
  type votedEntries = votedEntry[];

  const [competition, setCompetition] = useState<Competition>({
    competition_id: "",
    title: "",
    description: "",
    status: "active",
    start_date: "",
    end_date: "",
    prize: 0,
    entry_num: 0,
    voting_end_date: ""
  });
  
  const [entries, setEntries] = useState<Entries>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userVotedEntries, setUserVotedEntries] = useState<votedEntries>([]);
  

  useEffect(() => {
    if (!competitionId) return;
    
    const fetchCompetitionData = async () => {
      setIsLoading(true);
      try {
        // Fetch competition details
        const competitionUrl = `http://localhost/Recipe/api/api.php?action=get_competition_by_id&competition_id=${competitionId}`;
        const competitionResponse = await fetch(competitionUrl, {
          method: 'GET',  
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwidXNlcm5hbWUiOiJPR0MiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDM2Njk4MTgsImV4cCI6MTc0MzY3MzQxOH0=.bA8E4AoRTloJN5SK72CBCAOnKQk7pYF+U3gxdfuufF8=`,
            'Content-Type': 'application/x-www-form-urlencoded', 
          },
        });
        const competitionData = await competitionResponse.json();
        setCompetition(competitionData.data);
        
        // Fetch competition entries
        const entriesUrl = `http://localhost/Recipe/api/api.php?action=get_competition_recipes&competition_id=${competitionId}`;
        const entriesResponse = await fetch(entriesUrl, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwidXNlcm5hbWUiOiJPR0MiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDM2Njk4MTgsImV4cCI6MTc0MzY3MzQxOH0=.bA8E4AoRTloJN5SK72CBCAOnKQk7pYF+U3gxdfuufF8=`,
            'Content-Type': 'application/x-www-form-urlencoded',  
          },
        });
        const entriesData = await entriesResponse.json();
        
        if (entriesData.data) {
          const formattedEntries = entriesData.data.map((entry: any) => ({
            entry_id: entry.entry_id,
            title: entry.recipe_title,          
            description: entry.recipe_description,   
            username: entry.username,
            submission_date: entry.submission_date,
            number_of_votes: parseInt(entry.number_of_votes || '0')  
          }));
          setEntries(formattedEntries);
          console.log("Entries" ,formattedEntries);
        }
        // Fetch user voted entries
        const checkVoteUrl = `http://localhost/Recipe/api/api.php?action=get_user_voted_entries&user_id=2&competition_id=${competitionId}`;
        const checkVoteResponse = await fetch(checkVoteUrl, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwidXNlcm5hbWUiOiJPR0MiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDM2Njk4MTgsImV4cCI6MTc0MzY3MzQxOH0=.bA8E4AoRTloJN5SK72CBCAOnKQk7pYF+U3gxdfuufF8=`,
            'Content-Type': 'application/x-www-form-urlencoded',  
          },
        });
        const voteData = await checkVoteResponse.json();
        if (voteData.data) {
          const formattedVotes = voteData.data.map((vote: any) => ({
            entry_id: vote.entry_id,    
          }));
          setUserVotedEntries(formattedVotes);
        }
      } catch (error) {
        console.error("Error fetching competition data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetitionData();
  }, [competitionId]);

  // Add this to your state variables
const [votedEntries, setVotedEntries] = useState<string[]>([]);

// Replace your existing handleVoteClick function with this:
const handleVoteClick = async (entryId: string) => {
  try {
    const response = await fetch("http://localhost/Recipe/api/api.php", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwidXNlcm5hbWUiOiJPR0MiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDM2Njk4MTgsImV4cCI6MTc0MzY3MzQxOH0=.bA8E4AoRTloJN5SK72CBCAOnKQk7pYF+U3gxdfuufF8=`,
        'Content-Type': 'application/x-www-form-urlencoded',  
      },
      body: new URLSearchParams({
        action: 'vote_recipe',      
        user_id: '2',            
        entry_id: entryId
      }).toString(), 
    });
    
    if(response.ok) {
      // Update userVotedEntries so UI will immediately show the voted state
      setUserVotedEntries(prev => [...prev, { entry_id: entryId }]);
      
      // Update vote count in the entries array
      setEntries(entries.map(entry => 
        entry.entry_id === entryId 
          ? {...entry, number_of_votes: entry.number_of_votes + 1} 
          : entry
      ));
    }
  } catch (error) {
    console.error("Error voting:", error);
  }
};

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <div>Loading competition details...</div>
      </div>
    );
  }

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
                      {competition.status || 'Active'}
                    </Badge>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {competition.start_date} - {competition.end_date}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-primary">
                Prize RM{competition.prize} 
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 whitespace-pre-line">
                {competition.description}
              </p>

              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{competition.entry_num} recipe entries</span>
                </div>
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
            <TabsList className="w-full grid grid-cols-1">
              <TabsTrigger value="entries">Entries</TabsTrigger>
            </TabsList>

            <TabsContent value="entries" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Competition Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  {entries.length > 0 ? (
                    <div className="space-y-4">
                      {entries.map((entry) => (
                        <div
                          key={entry.entry_id}
                          className="border rounded-lg p-4 hover:border-primary transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium">{entry.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  by {entry.username} • {entry.submission_date}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Button variant='ghost' size='sm' onClick={() => handleVoteClick(entry.entry_id)}>
                              <ThumbsUp className={`mr-1 h-4 w-4 ${userVotedEntries.some(vote => vote.entry_id === entry.entry_id) 
                                ? "fill-current text-primary" 
                                : ""}`} />
                                {entry.number_of_votes}
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
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No entries have been submitted yet.
                    </div>
                  )}
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
                <div className="text-sm font-medium">Prize</div>
                <div className="text-xl font-bold text-primary mt-1">
                  RM{competition.prize}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Timeline</div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Submission Start</span>
                    <span>{competition.start_date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Submission End</span>
                    <span>{competition.end_date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Voting End Date</span>
                    <span>{competition.voting_end_date}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium">Top Entries</div>
                <div className="space-y-2 mt-2">
                  {entries.length > 0 ? (
                    entries
                      .sort((a, b) => b.number_of_votes - a.number_of_votes)
                      .slice(0, 3)
                      .map((entry, index) => (
                        <div
                          key={entry.entry_id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1 truncate">{entry.title}</div>
                          <Button 
                          variant='ghost' 
                          size='sm' 
                          onClick={() => handleVoteClick(entry.entry_id)}
                          disabled={userVotedEntries.some(vote => vote.entry_id === entry.entry_id)}
                          className={userVotedEntries.some(vote => vote.entry_id === entry.entry_id) 
                            ? "opacity-50 bg-gray-100" 
                            : ""}
                        >
                          <ThumbsUp className={`mr-1 h-4 w-4 ${userVotedEntries.some(vote => vote.entry_id === entry.entry_id) 
                            ? "fill-current text-primary" 
                            : ""}`} />
                          {entry.number_of_votes}
                        </Button>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No entries yet
                    </div>
                  )}
                </div>
              </div>

              <Separator />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}