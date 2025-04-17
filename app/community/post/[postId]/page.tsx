"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

// Helper function to get cookie value
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

interface Post {
  post_id: number;
  user_id: number;
  title: string;
  content: string;
  imageURL: string;
}

interface Comment {
  comment_id: number;
  username: string;
  comment: string;
  created_at: string;
  user_id: number;
}

export default function PostDetail() {
  const params = useParams();
  const postId = params.postId;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<number | null>(null);

  useEffect(() => {
    const userIdFromCookie = getCookie("user_id");
    if (userIdFromCookie) {
      setCurrentUser(parseInt(userIdFromCookie, 10));
    }
  }, []);

  useEffect(() => {
    if (!postId) return;

    const postIdNumber = parseInt(postId as string, 10);
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
        if (data.data) {
          setComments(data.data);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    const fetchLikeStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost/serverass/serverside-assignment/php/community/api/like.php?action=getLikeStatus&postId=${postId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      } catch (err) {
        console.error("Failed to fetch like status:", err);
      }
    };

    fetchPostDetails();
    fetchComments();
    fetchLikeStatus();
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
          credentials: "include",
          body: JSON.stringify({
            postId,
            content: newComment,
          }),
        }
      );
      const data = await res.json();

      if (data.message === "Comment added successfully") {
        setNewComment("");
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

  const handleToggleLike = async () => {
    try {
      const res = await fetch(
        "http://localhost/serverass/serverside-assignment/php/community/api/like.php?action=toggleLike",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ post_id: postId }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setLiked(data.liked);
        setLikeCount((prev) => prev + (data.liked ? 1 : -1));
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(
        `http://localhost/serverass/serverside-assignment/php/community/api/post.php?action=delete_post&id=${postId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
  
      const data = await res.json();
  
      if (data.message === "Post deleted successfully") {
        setShowSuccess(true);
        setTimeout(() => {
          window.location.href = "/community"; 
        }, 3000);
      } else {
        alert(data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("An error occurred while deleting the post.");
    }
  };  

  const handleDeleteComment = async (commentId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(
        `http://localhost/serverass/serverside-assignment/php/community/api/comment.php?action=deleteComment&commentId=${commentId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      
      if (data.success) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.comment_id !== commentId)
        );
      } else {
        alert(data.message || "Failed to delete comment");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("An error occurred while deleting the comment.");
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
    <>
    {showSuccess && (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-md shadow-md z-50 transition-all duration-300">
        Post deleted successfully!
      </div>
    )}


    <div className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/community">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Link>
        </Button>

        {/* Show Edit Button if Current User is the Owner of the Post */}
        {currentUser === post.user_id && (
          <>
            <Link href={`/community/post/editPost/${post.post_id}`}>
              <Button variant="outline" className="ml-4">Edit</Button>
            </Link>
            <Button
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleDeletePost}
            >
              Delete
            </Button>
          </>
        )}
      </header>

      <main>
        <article className="border rounded-lg overflow-hidden p-6">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-700 mb-6 whitespace-pre-line">
            {post.content}
          </p>

          {post.imageURL && (
            <div className="mb-6">
              <img
                src={post.imageURL}
                alt={post.title}
                className="w-full rounded-lg object-cover max-h-96"
              />
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <button
              aria-label="Toggle like"
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                liked
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={handleToggleLike}
            >
              {liked ? "♥ Liked" : "♡ Like"}
            </button>
            <span>{likeCount} likes</span>
          </div>
        </article>

        <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul className="space-y-4">
           {comments.map((comment, index) => {
            /////////
              console.log("Current User:", currentUser);
              console.log("Comment user_id:", comment.user_id);
              console.log("Comment id:", comment.comment_id);

              if (!comment.user_id) {
                console.error("Missing user_id for comment:", comment);
              }
              ///////////

              return (
                <li key={index} className="relative border rounded p-4">
                  <p className="font-semibold">{comment.username}</p>
                  <p>{comment.comment}</p>
                  <p className="text-sm text-gray-500">
                    Posted on{" "}
                    {new Date(comment.created_at).toLocaleString()}
                  </p>

                  {comment.user_id === currentUser && (
                    <Button
                      variant="ghost"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => handleDeleteComment(comment.comment_id)}
                    >
                      Delete
                    </Button>
                  )}
                </li>
              );
            })}

          </ul>
        )}

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
    </>
  );
}
