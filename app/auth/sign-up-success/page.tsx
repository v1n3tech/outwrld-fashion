import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ArrowRight } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Image src="/images/outwrld-logo.png" alt="Outwrld" width={40} height={40} className="invert" />
            <span className="font-display text-2xl font-bold text-primary">OUTWRLD</span>
          </Link>
        </div>

        <Card className="border-border/50 text-center">
          <CardHeader className="space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-display text-xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent you a confirmation link to complete your registration and join the Outwrld community.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Click the link in your email to verify your account.</p>
              <p>Don't see the email? Check your spam folder.</p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/auth/login">
                  Continue to Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">Return to Store</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
