import type React from "react"
import type { Metadata } from "next"
import { Aldrich } from "next/font/google"
import { Abel } from "next/font/google"
import { Orbitron } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/hooks/use-cart"
import { AuthProvider } from "@/hooks/use-auth"
import "./globals.css"

const aldrich = Aldrich({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-aldrich",
})

const abel = Abel({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-abel",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "Outwrld - Avant-Garde Nigerian Streetwear",
  description:
    "Revolutionary streetwear with exceptional quality and eclectic variety. Premium merch blending urban edge with Nigerian cultural flair.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    
    <html lang="en">
      <body className={`font-sans ${aldrich.variable} ${abel.variable} ${orbitron.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
