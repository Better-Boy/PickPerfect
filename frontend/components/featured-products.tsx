"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from 'lucide-react'
import { useCart } from "@/components/cart-provider"

const products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    image: "/images/featured-product-1.png",
    category: "men",
    isNew: true,
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 59.99,
    image: "/images/featured-product-2.png",
    category: "men",
    isNew: false,
  },
  {
    id: 3,
    name: "Summer Floral Dress",
    price: 79.99,
    image: "/images/featured-product-3.png",
    category: "women",
    isNew: true,
  },
  {
    id: 4,
    name: "Casual Hoodie",
    price: 49.99,
    image: "/images/featured-product-4.png",
    category: "men",
    isNew: false,
  },
  {
    id: 12,
    name: "Leather Boots",
    price: 129.99,
    image: "/images/featured-product-5.png",
    category: "men",
    isNew: true,
  },
]

export function FeaturedProducts() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col items-center text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
        <p className="text-sm text-muted-foreground max-w-[500px]">Our most popular items, handpicked for you</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }) {
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
