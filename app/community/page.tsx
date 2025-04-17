"use client"

import { ArrowLeft, ChevronDown, Filter, Plus, Search } from "lucide-react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

interface Post {
  post_id: number
  userId: number
  userName: string
  userAvatar: string
  title: string
  content: string
  imageURL: string
  created_at: string
  likesCount: number
  commentsCount: number
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
            <Button className="bg-orange-500 hover:bg-orange-600">
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Latest</Button>
              <Button variant="outline" size="sm">Popular</Button>
              <Button variant="outline" size="sm">Following</Button>
            </div>
          </div>
          <div className="grid gap-6">
            <CommunityFeed />
          </div>
        </section>
      </main>
    </div>
  )
}

function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost/serverass/serverside-assignment/php/community/api/post.php?action=getAllPosts")
        const text = await res.text();  
        console.log("Raw Response:", text);
        
        const data = JSON.parse(text); 
        console.log("Fetched Posts:", data);
    
        if (data.data) {
          setPosts(data.data);
        } else {
          console.error("No post data found:", data);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false); 
      }
    }
    fetchPosts(); 
  }, [])

  if (loading) {
    return <p>Loading posts...</p>
  }

  return (
    <>
      {posts.map((post) => (
        <Link href={`/community/post/${post.post_id}`} key={post.post_id}>
          <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src={post.userAvatar || "/placeholder.svg"}
                  alt={post.userName || "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
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
      ))}
    </>
  )
}
