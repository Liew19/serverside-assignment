"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Share2, ThumbsUp, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import RecipeSubmissionForm from "@/components/recipe-submission-form"
import EditCompetitionDialog from "@/components/edit-competition-dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

// In Next.js App Router, page props contain the route parameters
export default function CompetitionDetailPage({
  params,
}: {
  params: { id: string}
}) {
  const competitionId = params.id
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");

  interface Competition {
    competition_id: string
    title: string
    description: string
    status: "active" | "upcoming" | "past"
    start_date: string
    end_date: string
    voting_end_date: string
    entry_num: number
    prize: number
  }

  interface Entry {
    entry_id: string
    title: string
    description: string
    username: string
    submission_date: string
    number_of_votes: number
  }
  type Entries = Entry[]

  interface votedEntry {
    entry_id: string
  }
  type votedEntries = votedEntry[]

  interface userRecipe{
    recipe_id: number
    title: string
  }

  const [competition, setCompetition] = useState<Competition>({
    competition_id: "",
    title: "",
    description: "",
    status: "active",
    start_date: "",
    end_date: "",
    prize: 0,
    entry_num: 0,
    voting_end_date: "",
  })

  const [entries, setEntries] = useState<Entries>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userVotedEntries, setUserVotedEntries] = useState<votedEntries>([])
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [userRecipes, setUserRecipes] = useState<userRecipe[]>([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [winner, setWinner] = useState<{entry_id: string, title: string, number_of_votes: string} | null>(null);
  const [showEndCompetitionDialog, setShowEndCompetitionDialog] = useState(false)
  const [admin, setAdmin] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const [deleteReason, setDeleteReason] = useState("")

  useEffect(() => {
    if (!user_id || !competitionId) return;
    const checkStatus = async() =>{   //to check if user did fake admin id in get
      const checkUrl = `http://localhost/server/php/competition/api/user.php`
      const checkStatus = await fetch(checkUrl, {
        credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            action: "check_status",
            user_id: user_id
          }).toString(),
      })
      const status = await checkStatus.json()
      console.log("status", status);
      if(status.status == true){
        if(status.admin == true){
          setAdmin(true);
          console.log("you are admin")
        }else{
          setAdmin(false);
          console.log("you are not admin")
        }
      }else{
        setAdmin(false);
      }
    }
    checkStatus();
    const fetchCompetitionData = async () => {
      setIsLoading(true)
      try {
        // Fetch competition details
        const competitionUrl = `http://localhost/server/php/competition/api/user.php?action=get_competition_by_id&competition_id=${competitionId}`
        const competitionResponse = await fetch(competitionUrl, {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
        })
        const competitionData = await competitionResponse.json()
        setCompetition(competitionData.data)

        // Fetch competition entries
        fetchEntries();

        // Fetch user voted entries
        const checkVoteUrl = `http://localhost/server/php/competition/api/user.php?action=get_user_voted_entries&user_id=${user_id}&competition_id=${competitionId}`
        const checkVoteResponse = await fetch(checkVoteUrl, {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        const voteData = await checkVoteResponse.json()
        if (voteData.data) {
          const formattedVotes = voteData.data.map((vote: any) => ({
            entry_id: vote.entry_id,
          }))
          setUserVotedEntries(formattedVotes)
          console.log("User vote history" + voteData);
        }

        //fetch user recipe
        const userRecipeUrl = `http://localhost/server/php/competition/api/user.php?action=get_user_recipe&user_id=${user_id}`
        const checkUserRecipeResponse = await fetch(userRecipeUrl, {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        const recipeData = await checkUserRecipeResponse.json();
        console.log("user recipe", recipeData);
        if (recipeData && recipeData.status === "success" && Array.isArray(recipeData.data)) {
          setUserRecipes(recipeData.data.map((recipe: any) => ({
            recipe_id: recipe.recipe_id,
            title: recipe.title
          })));
        } else if (recipeData && recipeData.data && !Array.isArray(recipeData.data)) {
          // Handle case where data might be a single object instead of array
          setUserRecipes([{
            recipe_id: recipeData.data.recipe_id,
            title: recipeData.data.title
          }]);
        } else {
          console.log("No recipes found or unexpected data structure", recipeData);
          setUserRecipes([]);
        }
        
        console.log("competition data", competitionData);
        //fetch winner is past competition is used
        if (competitionData.data && competitionData.data.status === "past") {
          const winnerUrl = `http://localhost/server/php/competition/api/user.php?action=get_winner&competition_id=${competitionId}`
          const winnerResponse = await fetch(winnerUrl, {
            credentials: "include",
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          const winnerData = await winnerResponse.json()
          console.log("winner", winnerData);
          if (winnerData.data) {
            console.log(winnerData)
            const formattedWinner = winnerData.data.map((win: any) =>({
              entry_id: win.entry_id,
              title: win.title,
              number_of_votes: win.number_of_votes,
            }))
            setWinner(formattedWinner[0]);
            console.log("winner is ", winner);
          }
        }
      } catch (error) {
        console.error("Error fetching competition data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCompetitionData()
  }, [competitionId, user_id])

  useEffect(()=>{
    fetchEntries();
  }, [submissionCount])
  
  async function fetchEntries(){
    const entriesUrl = `http://localhost/server/php/competition/api/user.php?action=get_competition_recipes&competition_id=${competitionId}`
        const entriesResponse = await fetch(entriesUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        const entriesData = await entriesResponse.json()

        if (entriesData.data) {
          const formattedEntries = entriesData.data.map((entry: any) => ({
            entry_id: entry.entry_id,
            title: entry.recipe_title,
            description: entry.recipe_description,
            username: entry.username,
            submission_date: entry.submission_date,
            number_of_votes: Number.parseInt(entry.number_of_votes || "0"),
          }))
          setEntries(formattedEntries)
          console.log("Entries", formattedEntries)
        }
  }

  const [votedEntries, setVotedEntries] = useState<string[]>([])

  const handleVoteClick = async (entryId: string, userId: string) => {
    try {
      const response = await fetch("http://localhost/server/php/competition/api/user.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "vote_recipe",
          user_id: userId,
          entry_id: entryId,
        }).toString(),
      })

      if (response.ok) {
        // Update userVotedEntries so UI will immediately show the voted state
        setUserVotedEntries((prev) => [...prev, { entry_id: entryId }])

        // Update vote count in the entries array
        setEntries(
          entries.map((entry) =>
            entry.entry_id === entryId ? { ...entry, number_of_votes: entry.number_of_votes + 1 } : entry,
          ),
        )
      }
    } catch (error) {
      console.error("Error voting:", error)
    }
  }

  const handleEntrySubmitted = () => {
    // Refresh the entries list after a successful submission
    if (!competitionId) return

    const fetchEntries = async () => {
      try {
        const entriesUrl = `http://localhost/server/php/competition/api/user.php?action=get_competition_recipes&competition_id=${competitionId}`
        const entriesResponse = await fetch(entriesUrl, {
          credentials: "include",
          method: "GET",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwidXNlcm5hbWUiOiJPR0MiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDM2Njk4MTgsImV4cCI6MTc0MzY3MzQxOH0=.bA8E4AoRTloJN5SK72CBCAOnKQk7pYF+U3gxdfuufF8=`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        const entriesData = await entriesResponse.json()

        if (entriesData.data) {
          const formattedEntries = entriesData.data.map((entry: any) => ({
            entry_id: entry.entry_id,
            title: entry.recipe_title,
            description: entry.recipe_description,
            username: entry.username,
            submission_date: entry.submission_date,
            number_of_votes: Number.parseInt(entry.number_of_votes || "0"),
          }))
          setEntries(formattedEntries)
        }
      } catch (error) {
        console.error("Error refreshing entries:", error)
      }
    }

    fetchEntries()
  }

  const handleEndCompetition = async () => {
    try {
      const response = await fetch("http://localhost/server/php/competition/api/admin.php", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "set_competition_winner",
          competition_id: competitionId,
        }).toString(),
      })

      if (response.ok) {
        window.location.reload()
      } else {
        console.error("Failed to end competition")
      }
    } catch (error) {
      console.error("Error ending competition:", error)
    }
  }

  const handleDeleteEntry = async () => {
    if (!entryToDelete) return
    
    try {
      const response = await fetch("http://localhost/server/php/competition/api/admin.php", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "delete_competition_entry",
          entry_id: entryToDelete,
          delete_desc: deleteReason
        }).toString(),
      })
  
      if (response.ok) {
        // Remove the deleted entry from the entries array
        setEntries(entries.filter(entry => entry.entry_id !== entryToDelete))
        setShowDeleteDialog(false)
        setDeleteReason("")
        setEntryToDelete(null)
      } else {
        console.error("Failed to delete entry")
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <div>Loading competition details...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/competitions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Competitions
          </Link>
        </Button>

        {competition.status === "active" && admin && (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowEditDialog(true)}
              variant="outline"
            >
              Edit Competition
            </Button>
            <Button
              onClick={() => setShowEndCompetitionDialog(true)}
              variant="destructive"
            >
              Mark competition as ended
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
              <Trophy className="h-24 w-24 text-primary" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{competition.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-green-100">
                      {competition.status || "Active"}
                    </Badge>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {competition.start_date} - {competition.end_date}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-primary">Prize RM{competition.prize}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 whitespace-pre-line">{competition.description}</p>
  
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{competition.entry_num} recipe entries</span>
                </div>
              </div>
  
              <div className="flex justify-end">
                {competition.status === "active" && (
                  <Button onClick={() => setShowSubmissionForm(true)}>Submit Your Entry</Button>
                )}
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
                        <div>
                          <div className="font-medium flex items-center">
                            {entry.title}
                            {winner && winner.entry_id === entry.entry_id && (
                              <Badge className="bg-yellow-400 text-black ml-2">
                                <Trophy className="h-3 w-3 mr-1" /> Winner
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            by {entry.username} • {entry.submission_date}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {admin && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => {
                                setEntryToDelete(entry.entry_id)
                                setShowDeleteDialog(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleVoteClick(entry.entry_id, user_id!)}
                            disabled={
                              competition.status !== "active" || 
                              userVotedEntries.some((vote) => vote.entry_id === entry.entry_id) || 
                              user_id === null
                            }
                            className={
                              competition.status !== "active" || 
                              userVotedEntries.some((vote) => vote.entry_id === entry.entry_id) || 
                              user_id === null
                                ? "opacity-50 bg-gray-100 cursor-not-allowed"
                                : ""
                            }
                          >
                            <ThumbsUp
                              className={`mr-1 h-4 w-4 ${
                                userVotedEntries.some((vote) => vote.entry_id === entry.entry_id)
                                  ? "fill-current text-primary"
                                  : ""
                              }`}
                            />
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
                  <div className="text-center py-8 text-muted-foreground">No entries have been submitted yet.</div>
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
                <div className="text-xl font-bold text-primary mt-1">RM{competition.prize}</div>
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
  
              {competition.status === "past" ? (
                <div>
                  <div className="text-sm font-medium">Competition Winner</div>
                  <div className="space-y-2 mt-2">
                    {winner ? (
                      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          🏆
                        </div>
                        <div className="flex-1 truncate">{winner.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {winner.number_of_votes} votes
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-sm text-muted-foreground">No winner declared</div>
                    )}
                  </div>
                </div>
              ) : (
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
                              variant="ghost"
                              size="sm"
                              disabled={userVotedEntries.some((vote) => vote.entry_id === entry.entry_id)}
                              className={
                                userVotedEntries.some((vote) => vote.entry_id === entry.entry_id)
                                  ? "opacity-50 bg-gray-100"
                                  : ""
                              }
                            >
                              <ThumbsUp
                                className={`mr-1 h-4 w-4 ${
                                  userVotedEntries.some((vote) => vote.entry_id === entry.entry_id)
                                    ? "fill-current text-primary"
                                    : ""
                                }`}
                              />
                              {entry.number_of_votes}
                            </Button>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-4 text-sm text-muted-foreground">No entries yet</div>
                    )}
                  </div>
                </div>
              )}
  
              <Separator />
            </CardContent>
          </Card>
        </div>
      </div>
  
      <RecipeSubmissionForm
        open={showSubmissionForm}
        onOpenChange={setShowSubmissionForm}
        competitionId={competitionId}
        onSubmitSuccess={() => {
          // Increment submissionCount when a recipe is successfully submitted
          setSubmissionCount(prev => prev + 1)
          // Also, you can call your existing function to refetch the entries if needed.
          handleEntrySubmitted() 
          window.location.href = window.location.href;
        }}
        recipes={userRecipes.map(recipe => ({
          recipe_id: recipe.recipe_id.toString(), // Use the actual recipe_id from your data
          title: recipe.title
        }))}
        userId={user_id!}
      />
      <AlertDialog open={showEndCompetitionDialog} onOpenChange={setShowEndCompetitionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Competition</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this competition as ended? This will determine the winner based on votes and
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndCompetition}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditCompetitionDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        competitionId={competitionId}
      />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label htmlFor="delete-reason" className="block text-sm font-medium mb-2">
              Reason for deletion:
            </label>
            <Textarea
              id="delete-reason"
              placeholder="Please provide a reason for deleting this entry"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteReason("")
              setEntryToDelete(null)
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEntry}
              disabled={!deleteReason.trim()}
              className={!deleteReason.trim() ? "opacity-50 cursor-not-allowed" : ""}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
