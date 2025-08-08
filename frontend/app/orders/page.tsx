"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Package, Truck, CheckCircle, Clock, Eye, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { ordersAPI } from "@/lib/api"

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'

type OrderItem = {
  id: number
  name: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
  category: string
}

type Order = {
  id: string
  orderNumber: string
  status: OrderStatus
  orderDate: string
  deliveryDate?: string
  estimatedDelivery?: string
  total: number
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: OrderItem[]
  tracking?: {
    carrier: string
    trackingNumber: string
    status: string
  } | null
}

const statusConfig = {
  processing: {
    label: 'Processing',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-blue-100 text-blue-800',
    icon: Truck
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: Package
  }
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await ordersAPI.getUserOrders()
      setOrders(response.data.orders)
    } catch (error: any) {
      setError(error.message || "Failed to fetch orders")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusIcon = (status: OrderStatus) => {
    const StatusIcon = statusConfig[status].icon
    return <StatusIcon className="h-4 w-4" />
  }

  if (authLoading || isLoading) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-4">{error}</p>
          <Button onClick={fetchOrders} className="mt-6">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your purchases</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-medium">{user.name}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order {order.orderNumber}</CardTitle>
                      <CardDescription>
                        Placed on {formatDate(order.orderDate)}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={statusConfig[order.status].color}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{statusConfig[order.status].label}</span>
                      </Badge>
                      <p className="text-sm font-medium mt-1">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <Link 
                          key={`${item.id}-${item.size}-${item.color}`} 
                          href={`/products/${item.id}`}
                          className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium hover:text-primary transition-colors">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Separator />

                    {/* Order Status & Tracking */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Delivery Information</h4>
                        {order.status === 'delivered' && order.deliveryDate ? (
                          <p className="text-sm text-green-600">
                            ✅ Delivered on {formatDate(order.deliveryDate)}
                          </p>
                        ) : order.estimatedDelivery ? (
                          <p className="text-sm text-muted-foreground">
                            📦 Estimated delivery: {formatDate(order.estimatedDelivery)}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Processing your order...
                          </p>
                        )}
                        
                        {order.tracking && (
                          <div className="mt-2">
                            <p className="text-sm">
                              <span className="font-medium">Carrier:</span> {order.tracking.carrier}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Tracking:</span> {order.tracking.trackingNumber}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Shipping Address</h4>
                        <div className="text-sm text-muted-foreground">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Order Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        {order.tracking && (
                          <Button variant="outline" size="sm" asChild>
                            <a 
                              href={`https://www.${order.tracking.carrier.toLowerCase()}.com/tracking/${order.tracking.trackingNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Track Package
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Reorder Items
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
