"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, ShoppingBag, Search, User, LogOut, UserCircle, Store, Package, Calendar, Info } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount, loading } = useCart()
  const { user, profile, loading: authLoading, signOut } = useAuth()

  const navLinks = [
    { href: "/shop", label: "Shop", icon: Store },
    { href: "/collections", label: "Collections", icon: Package },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/about", label: "About", icon: Info },
  ]

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/"
  }

  const MobileSidebarContent = () => (
    <div className="flex flex-col h-full bg-background">
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-border">
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
          STORE
        </Badge>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-4 w-4 transition-colors text-muted-foreground group-hover:text-foreground" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer Section */}
      <div className="p-4 border-t border-border space-y-2">
        {user ? (
          <>
            <div className="px-3 py-2 mb-2">
              {profile?.first_name && profile?.last_name && (
                <p className="font-medium text-sm text-foreground">
                  {profile.first_name} {profile.last_name}
                </p>
              )}
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              asChild
            >
              <Link href="/account">
                <UserCircle className="mr-3 h-4 w-4" />
                <span className="truncate">Account</span>
              </Link>
            </Button>
            {(profile?.role === "admin" || profile?.role === "super_admin") && (
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                asChild
              >
                <Link href="/admin">
                  <UserCircle className="mr-3 h-4 w-4" />
                  <span className="truncate">Admin Dashboard</span>
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="truncate">Sign Out</span>
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            asChild
          >
            <Link href="/auth/login">
              <User className="mr-3 h-4 w-4" />
              <span className="truncate">Login</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <Image
              src="/images/outwrld-logo.png"
              alt="Outwrld"
              width={48}
              height={48}
              className="invert rounded-lg border-2 border-blue-500 p-1"
            />
          </div>
          <span className="font-display text-xl font-bold text-primary">OUTWRLD</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          {authLoading ? (
            <Button variant="ghost" size="icon" disabled>
              <User className="h-4 w-4" />
              <span className="sr-only">Account</span>
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Account menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {profile?.first_name && profile?.last_name && (
                      <p className="font-medium text-sm">
                        {profile.first_name} {profile.last_name}
                      </p>
                    )}
                    <p className="w-[200px] truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                {(profile?.role === "admin" || profile?.role === "super_admin") && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/auth/login">
                <User className="h-4 w-4" />
                <span className="sr-only">Login</span>
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingBag className="h-4 w-4" />
              {!loading && itemCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[320px] p-0 bg-background">
              <MobileSidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
