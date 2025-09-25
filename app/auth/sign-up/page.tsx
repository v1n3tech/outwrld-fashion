"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailedError, setDetailedError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setDetailedError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions")
      setIsLoading(false)
      return
    }

    try {
      const { data: testData, error: testError } = await supabase.from("profiles").select("count").limit(1)

      const signupOptions = {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/account`,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: "customer",
        },
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: signupOptions,
      })

      if (error) {
        if (error.message.includes("trigger") || error.message.includes("function")) {
          setError(`Database trigger error: ${error.message}`)
        } else if (error.message.includes("RLS") || error.message.includes("policy")) {
          setError(`Database policy error: ${error.message}`)
        } else {
          setError(`Signup failed: ${error.message}`)
        }

        setDetailedError({
          ...error,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        })
        throw error
      }

      if (data.user) {
        setTimeout(async () => {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single()
        }, 1000)
      }

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      if (error instanceof Error) {
      }

      setError(error instanceof Error ? error.message : "An error occurred")
      setDetailedError({
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
        timestamp: new Date().toISOString(),
        formData: { ...formData, password: "[REDACTED]", confirmPassword: "[REDACTED]" },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Image src="/images/outwrld-logo.png" alt="Outwrld" width={40} height={40} className="invert" />
            <span className="font-display text-2xl font-bold text-primary">OUTWRLD</span>
          </Link>
          <p className="text-muted-foreground">Join the avant-garde movement</p>
        </div>

        <Card className="border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="font-display text-xl">Create Account</CardTitle>
            <CardDescription>Start your journey with Outwrld streetwear</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className="bg-background pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className="bg-background pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 bg-muted/20">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={setAcceptTerms}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-2 border-primary/50 w-5 h-5"
                />
                <Label htmlFor="terms" className="text-sm font-medium">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:text-primary/80 underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {detailedError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>
                    <details className="text-xs">
                      <summary className="cursor-pointer font-medium mb-2">Debug Information (Click to expand)</summary>
                      <pre className="whitespace-pre-wrap bg-destructive/10 p-2 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(detailedError, null, 2)}
                      </pre>
                    </details>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  )
}
