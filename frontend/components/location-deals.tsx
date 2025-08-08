"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, MapPin, Truck, Clock, Percent } from 'lucide-react'
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { dealsAPI } from "@/lib/api"

type LocationDeal = {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  isNew: boolean
  discount: number
  warehouse: {
    location: string
    distance: number
    estimatedDelivery: string
  }
  dealReason: string
  savingsAmount: number
}

export function LocationDeals() {
  const { user, isLoading: authLoading } = useAuth()
  const { addToCart } = useCart()
  const [deals, setDeals] = useState<LocationDeal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    console.log('LocationDeals: Auth state changed', { user: !!user, authLoading, hasLocation: !!user?.location })
    if (!authLoading && user && user.location) {
      fetchLocationDeals()
    }
  }, [user, authLoading])

  const fetchLocationDeals = async () => {
    try {
      console.log('LocationDeals: Fetching deals for user location:', user?.location?.city)
      setIsLoading(true)
      setError("")
      const response = await dealsAPI.getLocationBasedDeals(user?.location)
      console.log('LocationDeals: Received deals:', response.data.deals.length)
      setDeals(response.data.deals.slice(0, 6)) // Show exactly 6 deals
    } catch (error: any) {
      console.error('LocationDeals: Error fetching deals:', error)
      setError(error.message || "Failed to fetch location deals")
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render if user is not logged in, still loading auth, or no location
  if (authLoading) {
    console.log('LocationDeals: Auth loading, not rendering')
    return null
  }

  if (!user) {
    console.log('LocationDeals: No user, not rendering')
    return null
  }

  if (!user.location) {
    console.log('LocationDeals: No user location, not rendering')
    return null
  }

  console.log('LocationDeals: Rendering for user:', user.name, { isLoading, error, dealsCount: deals.length })

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <h2 className="text-2xl font-bold tracking-tight">Local Deals Near You</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-[500px]">
            Loading exclusive deals from warehouses near {user.location.city}, {user.location.state}...
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
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
            <MapPin className="h-5 w-5 text-green-600" />
            <h2 className="text-2xl font-bold tracking-tight">Local Deals Near You</h2>
          </div>
          <p className="text-sm text-red-500">Failed to load local deals. Please try again later.</p>
        </div>
      </section>
    )
  }

  if (deals.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <h2 className="text-2xl font-bold tracking-tight">Local Deals Near You</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-[500px]">
            No local deals available in {user.location.city} right now. Check back soon!
          </p>
        </div>
      </section>
    )
  }

  const totalSavings = deals.reduce((sum, deal) => sum + deal.savingsAmount, 0)

  return (
    <section className="space-y-4">
      <div className="flex flex-col items-center text-center space-y-1">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <h2 className="text-2xl font-bold tracking-tight">Local Deals Near You</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-[500px]">
          Exclusive discounts from warehouses near {user.location.city}, {user.location.state}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Truck className="h-3 w-3 mr-1" />
            Fast Local Delivery
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Percent className="h-3 w-3 mr-1" />
            Save up to ${totalSavings.toFixed(2)}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {deals.map((deal) => (
          <LocationDealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  )
}

function LocationDealCard({ deal }: { deal: LocationDeal }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: deal.id,
      name: deal.name,
      price: deal.price,
      image: deal.image,
      category: deal.category,
      isNew: deal.isNew
    })
  }

  return (
    <Card className="overflow-hidden group relative border-green-200 hover:border-green-300 transition-colors">
      <Link href={`/products/${deal.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={deal.image || "/placeholder.svg"}
            alt={deal.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          
          {/* Discount Badge */}
          <Badge className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-xs px-1 py-0">
            <Percent className="h-2 w-2 mr-0.5" />
            {deal.discount}% OFF
          </Badge>
          
          {/* New Badge */}
          {deal.isNew && (
            <Badge className="absolute top-8 right-1 text-xs px-1 py-0">
              New
            </Badge>
          )}
        </div>
      </Link>
      
      <CardContent className="p-3">
        <Link href={`/products/${deal.id}`} className="hover:underline">
          <h3 className="font-medium text-sm line-clamp-2 leading-tight">{deal.name}</h3>
        </Link>
        
        <div className="flex items-center gap-1 mt-1">
          <p className="font-bold text-sm text-green-600">${deal.price.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground line-through">
            ${deal.originalPrice.toFixed(2)}
          </p>
        </div>
        
        <p className="text-xs text-green-600 font-medium mt-1">
          Save ${deal.savingsAmount.toFixed(2)}
        </p>
        
        <div className="flex items-center gap-1 mt-1">
          <Clock className="h-2 w-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {deal.warehouse.estimatedDelivery}
          </p>
        </div>
        
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {deal.dealReason}
        </p>
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Button className="w-full h-8 text-xs bg-green-600 hover:bg-green-700" size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="h-3 w-3 mr-1" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
