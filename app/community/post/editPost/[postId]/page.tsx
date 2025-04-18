"use client";

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
  const postId = params.postId;
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Base URL for images
  const imageBaseUrl = "http://localhost/server/serverside-assignment/public/";

  const currentUserId = 1; // Set user_id as 1

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost/server/php/community/api/post.php?action=getPostById&postId=${postId}`
        );
        const data = await res.json();

        if (data.data) {
          const normalizedPost = {
            ...data.data,
            userId: data.data.user_id,
          };

          console.log("Fetched Post:", normalizedPost);

          setPost(normalizedPost);
          setTitle(normalizedPost.title);
          setContent(normalizedPost.content);

          // Set the full image URL if imageURL exists
          if (normalizedPost.imageURL) {
            setCurrentImage(imageBaseUrl + normalizedPost.imageURL);
          }
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [title, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post || !currentUserId) return;

    // Ownership validation
    if (post.userId !== currentUserId) {
      setError("You don't have permission to edit this post");
      return;
    }

    // Input validation
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("action", "update_post");
      formData.append("post_id", postId.toString());
      formData.append("title", title);
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(
        "http://localhost/server/php/community/api/post.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.message === "Post updated successfully") {
        setError("Post updated successfully");

        // Delay redirect for 3 seconds to show success message
        setTimeout(() => {
          router.push(`/community/post/${postId}`);
        }, 3000);
      } else {
        setError(data.message || "Failed to update post");
      }
    } catch (err) {
      console.error("Update error:", err);
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

  if (post && currentUserId !== post.userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">
            You don't have permission to edit this post
          </p>
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
            <div
              className={`px-4 py-3 rounded mb-4 border ${
                error === "Post updated successfully"
                  ? "bg-green-100 border-green-400 text-green-700"
                  : "bg-red-100 border-red-400 text-red-700"
              }`}
            >
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
                className="w-full p-2 border border-blue-600 rounded-md bg-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                className="w-full p-2 border border-blue-600 rounded-md bg-white min-h-32"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Image (Optional)
              </label>

              {currentImage && !image && (
                <div className="mb-2">
                  <p className="text-sm mb-1">Current image:</p>
                  <img
                    src={currentImage}
                    alt="Current post image"
                    className="h-40 object-cover rounded-md"
                    onError={(e) => {
                      console.error("Image failed to load:", currentImage);
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x300?text=Image+Not+Found";
                    }}
                  />
                </div>
              )}

              {image && (
                <div className="mb-2">
                  <p className="text-sm mb-1">New image preview:</p>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="max-w-full h-auto object-cover"
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
                className="bg-blue-600 hover:bg-blue-500"
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
