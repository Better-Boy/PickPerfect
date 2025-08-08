"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ShieldCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  if (cartItems.length === 0 && !isComplete) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-4">You need to add items to your cart before checking out.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Thank you for your purchase. Your order has been confirmed and will be shipped soon.</p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">Order #12345</p>
              <p className="text-sm text-muted-foreground">A confirmation email has been sent to your email address.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate order processing
    setTimeout(() => {
      setIsSubmitting(false)
      setIsComplete(true)
      clearCart()
    }, 2000)
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cart">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

        <div className="space-y-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedColor && `, Color: ${item.selectedColor}`}
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Ready to Complete Your Order?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your items will be processed and shipped to your registered address.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing Order..." : "Complete Order"}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    By completing your order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>Secure checkout powered by StyleHub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
