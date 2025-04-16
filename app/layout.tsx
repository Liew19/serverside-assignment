"use client";

import type React from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ChefHat, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HamburgerMenu } from "@/components/ui/hamburger-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");

  const checkLoginStatus = async () => {
    const userId = getCookie("user_id");
    if (userId) {
      setIsLoggedIn(true);
      setUsername(getCookie("username")!);
      // Check if user is admin
      try {
        console.log("Checking admin status...");
        const response = await fetch(
          "http://localhost/server/php/recipes/api/admin.php",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "check_admin",
            }),
          }
        );

        if (!response.ok) {
          console.error("Admin check failed with status:", response.status);
          return;
        }

        // Check if response is empty
        const text = await response.text();
        console.log("Admin check response text:", text);

        if (!text) {
          console.error("Empty response from admin check");
          return;
        }

        const data = JSON.parse(text);
        console.log("Admin check parsed data:", data);

        if (data.success) {
          setIsAdmin(data.is_admin);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUsername("");
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost/server/php/auth/logout.php",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        document.cookie =
          "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUsername("");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift()!;
    return null;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center px-4">
                <Link
                  href={isLoggedIn ? "/main" : "/"}
                  className="flex items-center gap-2 font-semibold mr-8"
                >
                  <ChefHat className="h-6 w-6 text-primary" />
                  <span>CookMaster</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 mr-6">
                  <Link
                    href="/recipes"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Recipes
                  </Link>
                  {isLoggedIn && (
                    <>
                      <Link
                        href="/meal-planning"
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        Meal Planning
                      </Link>
                      <Link
                        href="/community"
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        Community
                      </Link>
                      <Link
                        href="/competitions"
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        Competitions
                      </Link>
                    </>
                  )}
                </nav>

                <div className="ml-auto flex items-center gap-4">
                  {isLoggedIn ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src="/placeholder.svg"
                              alt={username}
                            />
                            <AvatarFallback>
                              {username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isAdmin && (
                          <DropdownMenuItem>
                            <span className="text-sm font-medium text-primary">
                              Admin
                            </span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={handleLogout}>
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="ghost">Login</Button>
                      </Link>
                      <Link href="/register">
                        <Button>Register</Button>
                      </Link>
                    </>
                  )}
                </div>

                <HamburgerMenu className="ml-4 md:hidden">
                  <Link
                    href="/recipes"
                    className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                  >
                    Recipes
                  </Link>
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/meal-planning"
                        className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                      >
                        Meal Planning
                      </Link>
                      <Link
                        href="/community"
                        className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                      >
                        Community
                      </Link>
                      <Link
                        href="/competitions"
                        className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                      >
                        Competitions
                      </Link>
                      <div className="border-t mt-4 pt-4">
                        {isAdmin && (
                          <div className="py-2 text-primary">Admin User</div>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 py-2 hover:text-primary transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="border-t mt-4 pt-4">
                      <Link
                        href="/login"
                        className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </HamburgerMenu>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="py-8 bg-primary/5">
              <div className="container px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                    &copy; {new Date().getFullYear()} CookMaster. All rights
                    reserved.
                  </p>
                  <div className="flex gap-4">
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                      <span className="sr-only">Facebook</span>
                    </Link>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                      <span className="sr-only">Twitter</span>
                    </Link>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <rect
                          width="20"
                          height="20"
                          x="2"
                          y="2"
                          rx="5"
                          ry="5"
                        ></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                      <span className="sr-only">Instagram</span>
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
