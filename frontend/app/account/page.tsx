"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, ShoppingBag, Heart, Settings, LogOut, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"

export default function AccountPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                {user.location && (
                  <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {user.location.city}, {user.location.state}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Order History
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders yet</p>
                  <p className="text-sm">Start shopping to see your orders here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Full Name</h4>
                    <p className="text-muted-foreground">{user.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Email Address</h4>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button variant="outline">Edit Information</Button>
                </div>
              </CardContent>
            </Card>

            {user.location && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Your default delivery address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="font-medium">{user.location.address}</p>
                        <p className="text-muted-foreground">
                          {user.location.city}, {user.location.state} {user.location.zipCode}
                        </p>
                        <p className="text-muted-foreground capitalize">
                          {user.location.country}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button variant="outline">Edit Address</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
