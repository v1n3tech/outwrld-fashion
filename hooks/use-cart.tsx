"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { getCartItems } from "@/lib/actions/cart-actions"

interface CartItem {
  id: string
  user_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  created_at: string
  updated_at: string
  products: {
    id: string
    name: string
    slug: string
    base_price: number
    product_images: Array<{
      image_url: string
      alt_text: string
      is_primary: boolean
    }>
  }
  product_variants: {
    id: string
    name: string
    price: number
  } | null
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  loading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const refreshCart = async () => {
    try {
      const cartItems = await getCartItems()
      setItems(cartItems)
    } catch (error) {
      console.error("Error refreshing cart:", error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return <CartContext.Provider value={{ items, itemCount, loading, refreshCart }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
