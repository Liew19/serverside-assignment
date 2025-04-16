"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function NewPostPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.title || !formData.content) {
      toast({
        title: "Missing Fields",
        description: "Title and content are required.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const postData = new FormData()
    postData.append("action","createPost")
    postData.append("title", formData.title)
    postData.append("content", formData.content)
    if (formData.image) {
      postData.append("image", formData.image)
    }
    for (let [key, value] of postData.entries()) {
      console.log(key, value); // Logs: action createPost, title My New Post, content This is my post content
    }
    try {
      const response = await fetch("http://localhost/serverass/serverside-assignment/php/community/api/post.php", { //problem
        credentials: 'include',
        method: "POST",
        body: postData,
      })

      // console.log("Response status:", response.status);
      // console.log("Response type:", response.headers.get("content-type"));
      // const text = await response.text(); // Get raw text instead of json
      // console.log("Response body:", text);


      //const data = await response.json()

      const data2 = await response.text()
     // const data = JSON.parse(data2);

      if (response.ok ) {
        console.log("Response data:", data2); // no data retrieving back
        toast({
          title: "Post Published",
          description: "Your post has been successfully created.",
        })
        router.push("/community")
      } else {
        throw new Error("Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/community">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Link>
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Give your post a title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Share your culinary experience, recipe, or tip..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image (optional)</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image")?.click()}
                  className="flex items-center gap-2"
                >
                  <ImagePlus className="h-4 w-4" />
                  Upload Image
                </Button>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {formData.image && <span className="text-sm text-gray-500">{formData.image.name}</span>}
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Preview" className="max-h-64 rounded-md" />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="bg-[rgb(59,75,246)] hover:bg-[rgb(59,130,246,0.8)]">
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}