"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from 'lucide-react'
import { useCart } from "@/components/cart-provider"
import { ProductPagination } from "@/components/product-pagination"

type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string
  isNew: boolean
}

type ProductGridProps = {
  products: Product[]
  currentPage?: number
  totalPages?: number
  totalProducts?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
}

export function ProductGrid({ 
  products, 
  currentPage = 1, 
  totalPages = 1, 
  totalProducts = 0,
  onPageChange,
  isLoading = false 
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(15)].map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted" />
              <CardContent className="p-3">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <div className="h-8 bg-muted rounded w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <ProductPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalProducts={totalProducts}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <Card className="overflow-hidden group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.isNew && <Badge className="absolute top-1 right-1 text-xs px-1 py-0">New</Badge>}
        </div>
      </Link>
      <CardContent className="p-3">
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-medium text-sm line-clamp-2 leading-tight">{product.name}</h3>
        </Link>
        <p className="font-bold text-sm mt-1">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button className="w-full h-8 text-xs" size="sm" onClick={() => addToCart(product)}>
          <ShoppingCart className="h-3 w-3 mr-1" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
