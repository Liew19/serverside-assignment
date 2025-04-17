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
import { AlertCircle, CheckCircle2, ChefHat, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    // Clear error when user modifies inputs
    useEffect(() => {
        if (error) setError(null);
    }, [email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
        console.log("Checking email existence...");
        const response = await fetch(
            "http://localhost/server/php/auth/forgot_password.php",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                action: "forgot_password",
                email: email,
            }).toString(),
            }
        );

        const data = await response.json();

        if (data.status === "success") {
            console.log("Email exists, token generated");
            setSuccess(true);
            setToken(data.token);
        } else {
            console.log("Email check failed:", data.message);
            setError(data.message || "Email not found. Please check and try again.");
        }
        } catch (error) {
        console.error("Forgot password error:", error);
        setError("An error occurred. Please try again later.");
        } finally {
        setIsLoading(false);
        }
    };

    const handleContinue = () => {
        router.push(`/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
    };

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10 px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex items-center gap-2 mb-2">
                        <ChefHat className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold">CookMaster</span>
                    </Link>
                    <h1 className="text-2xl font-bold mt-4">Reset your password</h1>
                    <p className="text-muted-foreground text-center mt-2">
                        Enter your email to begin the password reset process
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>
                        First, let's verify your email address
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
                                        Email found! You can now reset your password.
                                    </AlertDescription>
                                </Alert>
                                <Button className="w-full" onClick={handleContinue}>
                                    Continue to Reset Password
                                </Button>
                                <div className="text-center mt-2">
                                    <Link
                                        href="/login"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Back to login
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Checking...
                                        </>
                                    ) : (
                                        "Continue"
                                    )}
                                </Button>

                                <div className="text-center mt-4">
                                    <Link
                                        href="/login"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Back to login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}