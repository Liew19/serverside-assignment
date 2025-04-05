import type React from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ChefHat, Search, Bell, User } from "lucide-react";
import { HamburgerMenu } from "@/components/ui/hamburger-menu";

import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CookMaster - Recipe Management & Meal Planning",
  description:
    "Your all-in-one platform for recipe management, meal planning, community engagement, and cooking competitions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center px-4">
                <Link
                  href="/"
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
                </nav>

                <div className="relative hidden md:flex flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search recipes..."
                    className="pl-8 w-full"
                  />
                </div>

                <div className="ml-auto flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" alt="User" />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/logout">Logout</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="hidden md:flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/register">Register</Link>
                    </Button>
                  </div>

                  <HamburgerMenu>
                    <Link
                      href="/recipes"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Recipes
                    </Link>
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
                  </HamburgerMenu>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-12 bg-primary/5">
              <div className="container px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <Link
                      href="/"
                      className="flex items-center gap-2 font-semibold mb-4"
                    >
                      <ChefHat className="h-6 w-6 text-primary" />
                      <span>CookMaster</span>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your all-in-one platform for recipe management, meal
                      planning, community engagement, and cooking competitions.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Features</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/recipes"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Recipe Management
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/meal-planning"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Meal Planning
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/community"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Community
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/competitions"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Competitions
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Resources</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/blog"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Blog
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/faq"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          FAQ
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/help"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Help Center
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Company</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/about"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/contact"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Contact
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/terms"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Terms
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/privacy"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Privacy
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
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
