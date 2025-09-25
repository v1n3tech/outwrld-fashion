import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, AlertTriangle } from "lucide-react"

export async function LowStockProducts() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      inventory_quantity,
      low_stock_threshold,
      product_images (
        image_url,
        is_primary
      )
    `)
    .eq("is_active", true)
    .lte("inventory_quantity", 10)
    .order("inventory_quantity", { ascending: true })
    .limit(5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <span>Low Stock Alert</span>
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products?filter=low-stock">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {products && products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product) => {
              const primaryImage = product.product_images.find((img) => img.is_primary)
              const isVeryLow = product.inventory_quantity <= (product.low_stock_threshold || 5)

              return (
                <div key={product.id} className="flex items-center space-x-4 p-3 border border-border rounded-lg">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.slug}</div>
                  </div>

                  <div className="text-right">
                    <Badge variant={isVeryLow ? "destructive" : "secondary"} className="mb-1">
                      {product.inventory_quantity} left
                    </Badge>
                    <div className="text-xs text-muted-foreground">Threshold: {product.low_stock_threshold || 5}</div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">All products are well stocked</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
