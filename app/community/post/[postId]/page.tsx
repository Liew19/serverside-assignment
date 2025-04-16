"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Post {
  post_id: number;
  title: string;
  content: string;
  imageURL: string;
}

interface Comment {
  username: string;
  comment: string;
  created_at: string;
}

export default function PostDetail() {
  const params = useParams();
  const postId = params.postId;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    if (!postId) return;

    // Directly parse the postId as it's expected to be a single string
    const postIdNumber = parseInt(postId as string, 10); // Ensure postId is treated as a string

    console.log("Parsed postIdNumber:", postIdNumber);

    if (isNaN(postIdNumber)) {
      console.error("Invalid postId:", postId);
      return;
    }

    const fetchPostDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost/serverass/serverside-assignment/php/community/api/post.php?action=getPostById&postId=${postIdNumber}`
        );
        const data = await res.json();

        if (data.data) {
          setPost(data.data);
        } else {
          console.error("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post details:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost/serverass/serverside-assignment/php/community/api/comment.php?action=getComments&postId=${postIdNumber}`
        );
        const data = await res.json();
        console.log("Comments data:", data); // Log the response data
        if (data.data) {
          setComments(data.data);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchPostDetails();
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setAddingComment(true);
    try {
      const res = await fetch(
        "http://localhost/serverass/serverside-assignment/php/community/api/comment.php?action=addComment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              postId,
              content: newComment,
            }),
          }
        );
      const data = await res.json();

      if (data.message === "Comment added successfully") {
        setNewComment("");
        // Reload comments
        const commentRes = await fetch(
          `http://localhost/serverass/serverside-assignment/php/community/api/comment.php?action=getComments&postId=${postId}`
        );
        const commentData = await commentRes.json();
        if (commentData.data) {
          setComments(commentData.data);
        }
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setAddingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Post not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/community">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Link>
        </Button>
      </header>

      <main>
        <article className="border rounded-lg overflow-hidden p-6">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-700 mb-6 whitespace-pre-line">{post.content}</p>

          {post.imageURL && (
            <div className="mb-6">
              <img
                src={post.imageURL}
                alt={post.title}
                className="w-full rounded-lg object-cover max-h-96"
              />
            </div>
          )}
        </article>

        {/* Comments Section */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment, index) => (
                <li key={index} className="border rounded p-4">
                  <p className="font-semibold">{comment.username}</p>
                  <p>{comment.comment}</p>
                  <p className="text-sm text-gray-500">
                    Posted on {new Date(comment.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mt-6">
            <label htmlFor="comment" className="block mb-2 font-medium">
              Add a Comment
            </label>
            <textarea
              id="comment"
              className="w-full p-3 border border-blue-600 rounded-md bg-white text-black"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              placeholder="Write your comment here..."
            />
            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={addingComment}
            >
              {addingComment ? "Adding..." : "Add Comment"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
