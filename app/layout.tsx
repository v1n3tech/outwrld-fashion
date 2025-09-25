"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Aldrich } from "next/font/google";
import { Abel } from "next/font/google";
import { Orbitron } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { CartProvider } from "@/hooks/use-cart";
import type { Metadata } from "next";
import "./globals.css";

// Font configurations
const aldrich = Aldrich({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-aldrich",
});

const abel = Abel({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-abel",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
});

// Metadata
export const metadata: Metadata = {
  title: "Outwrld - Avant-Garde Nigerian Streetwear",
  description:
    "Revolutionary streetwear with exceptional quality and eclectic variety. Premium merch blending urban edge with Nigerian cultural flair.",
  generator: "v0.app",
};

// Session Context for Supabase
export const SessionContext = createContext<any>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes (e.g., login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      router.refresh(); // Force re-render on change
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <SessionContext.Provider value={{ session, supabase }}>
      {children}
    </SessionContext.Provider>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${aldrich.variable} ${abel.variable} ${orbitron.variable} antialiased`}>
        <SessionProvider>
          <CartProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </CartProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
