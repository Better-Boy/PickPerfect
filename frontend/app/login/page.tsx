"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, MapPin, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("login")
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [geoCoordinates, setGeoCoordinates] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationDetected, setLocationDetected] = useState(false)
  const [detectedLocation, setDetectedLocation] = useState<string>("")
  
  const { login, register, isLoading } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    const result = await login(email, password)
    if (result.success) {
      // Redirect to home page after successful login
      router.push("/")
    } else {
      setError(result.error || "Login failed. Please try again.")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    if (!geoCoordinates) {
      setError("Location is required. Please allow location access to continue.")
      return
    }
    
    const result = await register({
      name,
      email,
      password,
      geoCoordinates
    })
    
    if (result.success) {
      // Redirect to home page after successful registration
      router.push("/")
    } else {
      setError(result.error || "Registration failed. Please try again.")
    }
  }

  const detectLocation = async () => {
    setIsDetectingLocation(true)
    setError("")
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Store the coordinates
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
            setGeoCoordinates(coords)
            setLocationDetected(true)
            
            // In a real app, you would use a reverse geocoding service to get the address
            // For demo purposes, we'll show a formatted location string
            const locationString = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
            setDetectedLocation(locationString)
            
          } catch (error) {
            console.error("Error processing location:", error)
            setError("Could not process location. Please try again.")
          } finally {
            setIsDetectingLocation(false)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          let errorMessage = "Location access is required to create an account."
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please allow location access and try again."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Please try again."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again."
              break
          }
          
          setError(errorMessage)
          setIsDetectingLocation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else {
      setError("Geolocation is not supported by this browser. Please use a modern browser to continue.")
      setIsDetectingLocation(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12 mx-auto">
      <div className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Sign in to your StyleHub account</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setActiveTab("register")}
                    >
                      Sign up
                    </button>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join StyleHub and start shopping</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password (min. 6 characters)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters long
                      </p>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Location Access Required</h3>
                      <p className="text-xs text-muted-foreground">
                        We need your location to provide personalized deals and accurate shipping information.
                      </p>
                    </div>
                    
                    {!locationDetected ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={detectLocation}
                        disabled={isDetectingLocation}
                        className="w-full"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {isDetectingLocation ? "Detecting Location..." : "Allow Location Access"}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-800">Location Detected</p>
                              <p className="text-xs text-green-600">{detectedLocation}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setLocationDetected(false)
                              setGeoCoordinates(null)
                              setDetectedLocation("")
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !locationDetected}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setActiveTab("login")}
                    >
                      Sign in
                    </button>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
