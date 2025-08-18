"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Eye, EyeOff, User, Lock } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError(
        "Agar parolni esdan chiqargan bo'lsangiz administratorga murojaat qiling (tel. *****)"
      );
      return;
    }
    // Handle login logic here
    console.log("Login attempt:", formData);
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#374151]"
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
            className="w-full h-12 bg-[#214b66] hover:bg-[#1f2937] text-white font-medium rounded-lg transition-colors duration-200"
          >
            Kirish
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
