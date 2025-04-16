"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Recipe {
  recipe_id: string
  title: string
}

interface RecipeSubmissionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  competitionId: string
  onSubmitSuccess: () => void
  recipes: Recipe[]
  userId?: string
}

export default function RecipeSubmissionForm({
  open,
  onOpenChange,
  competitionId,
  onSubmitSuccess,
  recipes,
  userId = "2",
}: RecipeSubmissionFormProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  // New state for inline feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string>("")
  // Track success (true) or error (false)
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

  // Reset selected recipe and feedback when dialog is closed
  useEffect(() => {
    if (!open) {
      setSelectedRecipe("")
      setFeedbackMessage("")
      setIsSuccess(null)
    }
  }, [open])

  const handleSubmit = async () => {
    if (!selectedRecipe) {
      setFeedbackMessage("Please select a recipe to submit")
      setIsSuccess(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost/server/php/competition/api/user.php", {
        credentials: 'include',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: new URLSearchParams({
          action: "submit_recipe",
          recipe_id: selectedRecipe,
          competition_id: competitionId,
        }).toString(),
      })
      console.log("response", response)
      
      // Try to parse the JSON from the response.
      const data = await response.json()
      
      if (data.status === 'success') {
        setFeedbackMessage("Your recipe has been submitted to the competition.")
        setIsSuccess(true)
        onSubmitSuccess()
      } else {
        setFeedbackMessage(data.message)  //show repeated submission
        setIsSuccess(false)
      }
    } catch (error) {
      console.error("Error submitting recipe:", error)
      setFeedbackMessage("Error message")
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  // This function will be called when a recipe is selected from the dropdown
  const handleRecipeSelect = (recipeId: string) => {
    setSelectedRecipe(recipeId)
    // Clear previous feedback message upon a new selection
    setFeedbackMessage("")
    setIsSuccess(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Recipe Entry</DialogTitle>
          <DialogDescription>
            Select one of your recipes to submit to this competition.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Recipe</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    disabled={recipes.length === 0}
                  >
                    {selectedRecipe
                      ? recipes.find((recipe) => recipe.recipe_id === selectedRecipe)?.title
                      : "Select a recipe"}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full" align="start">
                  <DropdownMenuLabel>Your Recipes</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {recipes.length === 0 ? (
                    <DropdownMenuItem disabled>
                      You don't have any recipes yet.
                    </DropdownMenuItem>
                  ) : (
                    recipes.map((recipe) => (
                      <DropdownMenuItem
                        key={recipe.recipe_id}
                        onClick={() => handleRecipeSelect(recipe.recipe_id)}
                        className="hover:bg-muted cursor-pointer transition-colors"
                      >
                        <div className="flex items-center w-full">
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedRecipe === recipe.recipe_id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span>{recipe.title}</span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Display inline feedback message */}
        {feedbackMessage && (
          <div className="mb-4 text-sm font-medium text-center">
            <span className={isSuccess ? "text-green-600" : "text-red-600"}>
              {feedbackMessage}
            </span>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline"  onClick={() => {
            onOpenChange(false);
            window.location.reload(); // force full page reload
          }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !selectedRecipe}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
