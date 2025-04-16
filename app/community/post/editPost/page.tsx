"use client"

import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Post {
  post_id: number;
  userId: number;
  title: string;
  content: string;
  imageURL: string;
}

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch current user
    const fetchCurrentUser = async () => {
      try {
        // In a real app, this would come from your auth system
        const userId = localStorage.getItem("userId");
        setCurrentUserId(userId ? parseInt(userId) : null);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    // Fetch post details
    const fetchPostDetails = async () => {
      try {
        const res = await fetch(`http://localhost/serverass/serverside-assignment/php/community/api/post.php?action=getPostById&postId=${postId}`);
        const data = await res.json();
        
        if (data.data) {
          setPost(data.data);
          setTitle(data.data.title);
          setContent(data.data.content);
          setCurrentImage(data.data.imageURL || "");
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
    fetchPostDetails();
  }, [postId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!post || !currentUserId) return;
    
    // Validate user is the owner
    if (post.userId !== currentUserId) {
      setError("You don't have permission to edit this post");
      return;
    }
    
    // Validate form
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("action", "updatePost");
      formData.append("postId", postId.toString());
      formData.append("userId", currentUserId.toString());
      formData.append("title", title);
      formData.append("content", content);
      
      if (image) {
        formData.append("image", image);
      }
      
      const res = await fetch("http://localhost/serverass/serverside-assignment/php/community/api/post.php", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Redirect to post detail page
        router.push(`/community/post/${postId}`);
      } else {
        setError(data.message || "Failed to update post");
      }
    } catch (err) {
      console.error("Error updating post:", err);
      setError("An error occurred while updating the post");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Check if user is the owner
  if (post && currentUserId !== post.userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">You don't have permission to edit this post</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild>
          <Link href={`/community/post/${postId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Post
          </Link>
        </Button>
      </header>

      <main>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full p-2 border rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content
              </label>
              <textarea
                id="content"
                className="w-full p-2 border rounded-md min-h-32"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Image (Optional)
              </label>
              
              {currentImage && (
                <div className="mb-2">
                  <p className="text-sm mb-1">Current image:</p>
                  <img
                    src={currentImage}
                    alt="Current post image"
                    className="h-40 object-cover rounded-md"
                  />
                </div>
              )}
              
              <div className="mt-2">
                <label className="cursor-pointer flex items-center gap-2 border rounded-md p-3 hover:bg-gray-50">
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                  <span>{image ? image.name : "Choose new image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/community/post/${postId}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}