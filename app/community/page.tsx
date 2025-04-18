"use client";

import { ArrowLeft, PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";

// Post interface
interface Post {
  post_id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  imageURL: string;
  created_at: string;
  likesCount: number;
  commentsCount: number;
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="flex items-center gap-4">
          <Link href="/community/post/addPost">
            <Button className="bg-blue-600 hover:bg-blue-500">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
      </header>

      <main>
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Community Feed</h2>
          </div>
          <CommunityFeed />
        </section>
      </main>
    </div>
  );
}

// Function to get cookie value by name
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined" || !document.cookie) return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift()!;
  return null;
};

// Helper function to get initials from user name
const getInitials = (name: string | undefined): string => {
  if (!name) return "A"; // Return an empty string if name is undefined or empty
  const nameParts = name.split(" ");
  return nameParts
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");
};

function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "latest" | "popular" | "mine">(
    "all"
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const userId = getCookie("user_id");
    setCurrentUserId(userId);
    console.log("Current user ID from cookie:", userId);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      let url = "http://localhost/server/php/community/api/post.php";

      switch (filter) {
        case "latest":
          url += "?action=getAllPosts";
          break;
        case "popular":
          url += "?action=getPopularPosts";
          break;
        case "mine":
          if (currentUserId) {
            url += `?action=getUserPosts&userId=${currentUserId}`;
          } else {
            url += "?action=getAllPosts"; //
          }
          break;
        default:
          url += "?action=getAllPosts";
      }

      try {
        const res = await fetch(url);
        const text = await res.text();
        console.log("Raw Response:", text);

        const data = JSON.parse(text);
        console.log("Fetched Posts:", data);

        if (data.data) {
          setPosts(data.data);
        } else {
          setPosts([]);
          console.error("No post data found:", data);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filter, currentUserId]);

  if (loading) return <p>Loading posts...</p>;

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === "latest" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("latest")}
        >
          Latest
        </Button>
        <Button
          variant={filter === "popular" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("popular")}
        >
          Popular
        </Button>
        <Button
          variant={filter === "mine" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("mine")}
        >
          My Post
        </Button>
      </div>

      <div className="grid gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link href={`/community/post/${post.post_id}`} key={post.post_id}>
              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {/* Display either avatar or initials if avatar is missing */}
                    {post.userAvatar ? (
                      <Image
                        src={post.userAvatar}
                        alt={post.userName || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {getInitials(post.userName)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{post.userName}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  {post.imageURL && (
                    <img
                      src={post.imageURL}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-md mb-4"
                    />
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">{post.likesCount} likes</span>
                    <span>{post.commentsCount} comments</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </>
  );
}
