"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Eye, EyeOff, User, Lock, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Login va parolni kiriting");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Mock authentication - check against test credentials
      if (formData.username === "admin" && formData.password === "123") {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Store mock authentication data
        localStorage.setItem("authToken", "mock-jwt-token-" + Date.now());
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "1",
            name: "Admin User",
            role: "Administrator",
            username: "admin",
            email: "admin@example.com",
          })
        );

        // Redirect to root route
        router.push("/");
      } else {
        setError("Noto'g'ri login yoki parol. Test ma'lumotlarini tekshiring.");
      }
    } catch (error) {
      setError("Tizimda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <Card className="w-full max-w-md mx-auto corporate-card">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-semibold text-[#1f2937] mb-2">
          E-BYULLETEN
        </CardTitle>
        <p className="text-[#6b7280] text-sm">
          Tizimga kirish uchun ma'lumotlaringizni kiriting
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-medium text-[#374151]"
            >
              Login
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-4 h-4" />
              <Input
                id="username"
                type="text"
                placeholder="Login"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="pl-10 h-12 bg-[#f9fafb] border-[#e5e7eb] focus:border-[#4978ce] focus:ring-[#4978ce]"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-[#374151]"
            >
              Parol
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Parol"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10 h-12 bg-[#f9fafb] border-[#e5e7eb] focus:border-[#4978ce] focus:ring-[#4978ce]"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#374151] disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-[#214b66] hover:bg-[#1f2937] text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Kirish...
              </>
            ) : (
              "Kirish"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
