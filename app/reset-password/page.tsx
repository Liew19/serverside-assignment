"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, ChefHat, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    // Redirect on success
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                router.push("/login");
            }, 3000);
        return () => clearTimeout(timer);
        }
    }, [success, router]);

    useEffect(() => {
        if (!token || !email) {
            setError("Invalid or expired password reset link. Please request a new one.");
        }
    }, [token, email]);

    useEffect(() => {
        if (error) setError(null);
    }, [password, confirmPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match. Please try again.");
            return;
        }
        
        // Validate password length
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        
        setIsLoading(true);
        setError(null);

        try {
            console.log("Sending password reset request...");
            const response = await fetch(
                "http://localhost/server/php/auth/reset_password.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        action: "reset_password",
                        email: email as string,
                        token: token as string,
                        password: password,
                    }).toString(),
                }
            );

            const data = await response.json();

            if (data.status === "success") {
                console.log("Password reset successful");
                setSuccess(true);
            } else {
                console.log("Password reset failed:", data.message);
                setError(data.message || "Failed to reset password. Please try again.");
            }
        } catch (error) {
            console.error("Password reset error:", error);
            setError("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10 px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex items-center gap-2 mb-2">
                        <ChefHat className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold">CookMaster</span>
                    </Link>
                    <h1 className="text-2xl font-bold mt-4">Create new password</h1>
                    <p className="text-muted-foreground text-center mt-2">
                        Enter a new password for your account
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>
                        Create a new password for your CookMaster account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success ? (
                            <div className="space-y-4">
                                <Alert
                                    variant="default"
                                    className="mb-4 bg-green-50 border-green-200 text-green-800"
                                >
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <AlertDescription>
                                        Your password has been reset successfully! Redirecting to login page...
                                    </AlertDescription>
                                </Alert>
                                <Button asChild className="w-full">
                                    <Link href="/login">Go to login now</Link>
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading || !token || !email}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading || !token || !email}
                                        >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? "Hide password" : "Show password"}
                                        </span>
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Password must be at least 8 characters long
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isLoading || !token || !email}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            disabled={isLoading || !token || !email}
                                            >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="sr-only">
                                                {showConfirmPassword ? "Hide password" : "Show password"}
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    disabled={isLoading || !token || !email}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resetting password...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}