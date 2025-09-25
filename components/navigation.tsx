"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, ShoppingCart, User } from "lucide-react"; // adjust icons if needed
import { useAuth } from "@/hooks/use-auth";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const toggleAccount = () => setAccountOpen((prev) => !prev);

  const handleSignOut = async () => {
    try {
      await signOut(); // useAuth handles clearing state and hard reload
    } catch (err) {
      console.error("Sign out error:", err);
      // Fallback navigation if signOut fails silently
      if (typeof window !== "undefined") window.location.href = "/";
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "About", href: "/about" },
  ];

  const isActive = (href: string) => (pathname === href ? "text-black font-semibold" : "text-gray-600");

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Outwrld Fashion" width={32} height={32} />
          <span className="font-bold text-xl">Outwrld</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-black ${isActive(link.href)}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side (cart + account) */}
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative group">
            <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-black transition-colors" />
            {/* TODO: add badge for cart items if needed */}
          </Link>

          {/* Account menu */}
          <div className="relative">
            <button
              onClick={toggleAccount}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Account menu"
            >
              <User className="h-6 w-6 text-gray-700" />
            </button>

            {accountOpen && (
              <div
                className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg z-50"
                onMouseLeave={() => setAccountOpen(false)}
              >
                <div className="py-2">
                  {user ? (
                    <>
                      <p className="px-4 py-2 text-sm text-gray-600">
                        {profile?.first_name
                          ? `Hi, ${profile.first_name}`
                          : user.email}
                      </p>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Account
                      </Link>
                      {profile?.role === "admin" || profile?.role === "super_admin" ? (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin
                        </Link>
                      ) : null}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobile}
            className="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-gray-50 ${isActive(
                  link.href
                )}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Account
                  </Link>
                  <button
                    onClick={async () => {
                      setMobileOpen(false);
                      await handleSignOut();
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
