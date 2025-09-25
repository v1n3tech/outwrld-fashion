"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, ArrowRight } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement newsletter subscription
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubscribed(true)
    setIsLoading(false)
    setEmail("")
  }

  if (isSubscribed) {
    return (
      <section className="py-16 md:py-24">
        <div className="container max-w-screen-xl px-4">
          <Card className="bg-secondary/10 border-secondary/20">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-primary">Welcome to the Movement</h3>
                <p className="text-foreground/70">
                  You're now part of the Outwrld community. Get ready for exclusive drops and cultural insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-screen-xl px-4">
        <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-primary/20">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="space-y-4">
                <h3 className="font-display text-3xl md:text-4xl font-bold text-balance">
                  <span className="text-primary">JOIN THE</span> <span className="text-foreground">MOVEMENT</span>
                </h3>
                <p className="text-lg text-foreground/70 text-pretty">
                  Be the first to know about new drops, exclusive events, and cultural collaborations. Join our
                  community of style pioneers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-background/50 border-border/50 focus:border-primary"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? "Joining..." : "Join Now"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <p className="text-xs text-foreground/50">
                By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
