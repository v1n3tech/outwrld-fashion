"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function AdminSetupPage() {
  const [email, setEmail] = useState("mantimdanzaki@gmail.com")
  const [password, setPassword] = useState("password")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/admin`,
        },
      })

      if (error) {
        setMessage(error.message)
        setIsSuccess(false)
      } else if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: "Admin User",
          role: "admin",
        })

        if (profileError) {
          setMessage(`User created but profile update failed: ${profileError.message}`)
          setIsSuccess(false)
        } else {
          setMessage("Admin user created successfully! You can now sign in.")
          setIsSuccess(true)
        }
      }
    } catch (error) {
      setMessage("An unexpected error occurred")
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">Admin Setup</CardTitle>
          <CardDescription>Create the default admin account for Outwrld</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {message && (
              <Alert className={isSuccess ? "border-green-500" : "border-red-500"}>
                {isSuccess ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Admin..." : "Create Admin Account"}
            </Button>
          </form>

          {isSuccess && (
            <div className="mt-4 pt-4 border-t border-border">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a href="/auth/login">Go to Login</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
