"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Sparkles, Percent } from 'lucide-react'
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { recommendationsAPI } from "@/lib/api"

type RecommendedProduct = {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew: boolean
  discount?: number
  reason: string
}

export function RecommendedProducts() {
  const { user, isLoading: authLoading } = useAuth()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<RecommendedProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    console.log('RecommendedProducts: Auth state changed', { user: !!user, authLoading })
    if (!authLoading && user) {
      fetchRecommendations()
    }
  }, [user, authLoading])

  const fetchRecommendations = async () => {
    try {
      console.log('RecommendedProducts: Fetching recommendations for user:', user?.name)
      setIsLoading(true)
      setError("")
      const response = await recommendationsAPI.getRecommendedProducts()
      console.log('RecommendedProducts: Received products:', response.data.products.length)
      setProducts(response.data.products.slice(0, 5)) // Show exactly 5 products
    } catch (error: any) {
      console.error('RecommendedProducts: Error fetching recommendations:', error)
      setError(error.message || "Failed to fetch recommendations")
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render if user is not logged in or still loading auth
  if (authLoading) {
    console.log('RecommendedProducts: Auth loading, not rendering')
    return null
  }

  if (!user) {
    console.log('RecommendedProducts: No user, not rendering')
    return null
  }

  console.log('RecommendedProducts: Rendering for user:', user.name, { isLoading, error, productsCount: products.length })

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Recommended for You</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-[500px]">Loading personalized recommendations...</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted" />
              <CardContent className="p-3">
                <div className="h-3 bg-muted rounded mb-1" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-4">
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Recommended for You</h2>
          </div>
          <p className="text-sm text-red-500">Failed to load recommendations. Please try again later.</p>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Recommended for You</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-[500px]">
            Building your personalized recommendations...
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col items-center text-center space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Recommended for You</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-[500px]">
          Curated picks based on your style and purchase history
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((product) => (
          <RecommendedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function RecommendedProductCard({ product }: { product: RecommendedProduct }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      isNew: product.isNew
    })
  }

  return (
    <Card className="overflow-hidden group relative">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.isNew && <Badge className="absolute top-1 right-1 text-xs px-1 py-0">New</Badge>}
          {product.discount && (
            <Badge className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-xs px-1 py-0">
              <Percent className="h-2 w-2 mr-0.5" />
              {product.discount}%
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-3">
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-medium text-sm line-clamp-2 leading-tight">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <p className="font-bold text-sm">${product.price.toFixed(2)}</p>
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {product.reason}
        </p>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button className="w-full h-8 text-xs" size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="h-3 w-3 mr-1" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
