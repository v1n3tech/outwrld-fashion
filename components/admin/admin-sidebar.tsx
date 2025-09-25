"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createBrowserClient } from "@supabase/ssr"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Calendar,
  Settings,
  BarChart3,
  Tag,
  Menu,
  LogOut,
  Store,
  Percent,
  Truck,
} from "lucide-react"

const useOrderCount = () => {
  const [orderCount, setOrderCount] = useState<number>(0)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const fetchOrderCount = async () => {
      try {
        const { count } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")

        setOrderCount(count || 0)
      } catch (error) {
        console.error("Error fetching order count:", error)
      }
    }

    fetchOrderCount()

    // Set up real-time subscription for order updates
    const channel = supabase
      .channel("orders-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchOrderCount())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return orderCount
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const orderCount = useOrderCount()

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Tag,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      badge: orderCount > 0 ? orderCount.toString() : undefined,
    },
    {
      name: "Shipping",
      href: "/admin/shipping",
      icon: Truck,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: Calendar,
    },
    {
      name: "Slider",
      href: "/admin/slider",
      icon: LayoutDashboard,
    },
    {
      name: "Promotions",
      href: "/admin/promotions",
      icon: Percent,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-screen bg-background">
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Image
              src="/images/outwrld-logo.png"
              alt="Outwrld"
              width={32}
              height={32}
              className="invert dark:invert-0 rounded-lg border-2 border-blue-500 p-1"
            />
          </div>
          <span className="font-display text-lg font-bold text-primary">OUTWRLD</span>
        </div>
        <Badge variant="secondary" className="text-xs font-medium">
          ADMIN
        </Badge>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-3 py-4 min-h-0">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant={isActive ? "secondary" : "outline"}
                    className="ml-2 text-xs font-medium min-w-[20px] h-5 flex items-center justify-center"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer Section */}
      <div className="p-4 border-t border-border space-y-2 flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          asChild
        >
          <Link href="/">
            <Store className="mr-3 h-4 w-4" />
            <span className="truncate">View Store</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="truncate">Sign Out</span>
        </Button>
      </div>
    </div>
  )

  const MobileTrigger = () => (
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:h-screen lg:fixed lg:left-0 lg:top-0 lg:z-30 lg:overflow-hidden">
        <SidebarContent />
      </div>

      {/* Mobile Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <MobileTrigger />
        <SheetContent side="left" className="w-[300px] sm:w-[320px] p-0 bg-background">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}

export function AdminSidebarMobileTrigger() {
  return (
    <Button variant="ghost" size="icon" className="lg:hidden">
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle navigation menu</span>
    </Button>
  )
}
