"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditCompetitionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  competitionId: string
}

export default function EditCompetitionDialog({ open, onOpenChange, competitionId }: EditCompetitionDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    voting_end_date: "",
    prize: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch competition details when dialog opens
  useEffect(() => {
    if (open && competitionId) {
      fetchCompetitionDetails()
    }
  }, [open, competitionId])

  const fetchCompetitionDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost/server/php/competition/api/user.php?action=get_competition_by_id&competition_id=${competitionId}`,
        {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      const data = await response.json()
      console.log("data is ", data);
      if (data.data) {
        // Format dates for input fields
        console.log("comp data fetched", data);
        setFormData({
          title: data.data.title || "",
          description: data.data.description || "",
          start_date: data.data.start_date || "",
          end_date: data.data.end_date || "",
          voting_end_date: data.data.voting_end_date || "",
          prize: data.data.prize || 0,
        })
      } else {
        setError("Failed to load competition details")
        console.log("cannot fetch data");
      }
    } catch (error) {
      console.error("Error fetching competition details:", error)
      setError("An error occurred while fetching competition details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "prize" ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost/server/php/competition/api/admin.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "update_competition",
          competition_id: competitionId,
          title: formData.title,
          description: formData.description,
          start_date: formData.start_date,
          end_date: formData.end_date,
          voting_end_date: formData.voting_end_date,
          prize: formData.prize.toString(),
        }).toString(),
      })

      const data = await response.json()

      if (data.status) {
        // Close dialog and refresh page
        onOpenChange(false)
        window.location.reload()
      } else {
        setError(data.message || "Failed to update competition")
      }
    } catch (error) {
      console.error("Error updating competition:", error)
      setError("An error occurred while updating the competition")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Competition</DialogTitle>
          <DialogDescription>
            Update the details of your competition below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="voting_end_date">Voting End Date</Label>
              <Input
                id="voting_end_date"
                name="voting_end_date"
                type="date"
                value={formData.voting_end_date}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prize">Prize Amount (RM)</Label>
              <Input
                id="prize"
                name="prize"
                type="number"
                min="0"
                step="0.01"
                value={formData.prize}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}