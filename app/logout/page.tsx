"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const logout = async () => {
      try {
        // Call server-side logout endpoint
        await fetch("http://localhost/server/php/auth/logout.php", {
          credentials: "include",
          method: "POST",
        });
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        // Delete client-side cookies
        document.cookie =
          "user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie =
          "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        // Set a short delay before redirecting
        setTimeout(() => {
          setIsLoading(false);
          router.push("/");
        }, 1000);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p>Clearing session data...</p>
          </div>
        ) : (
          <p>You are being redirected to the home page.</p>
        )}
      </div>
    </div>
  );
}
