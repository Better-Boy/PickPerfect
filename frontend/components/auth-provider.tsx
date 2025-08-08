"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "@/lib/api"

type User = {
  id: string
  email: string
  name: string
  location?: {
    geoCoordinates: {
      latitude: number
      longitude: number
    }
  }
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: {
    name: string
    email: string
    password: string
    geoCoordinates: {
      latitude: number
      longitude: number
    }
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      
      // Check if auth cookie exists (simple check for demo)
      const hasAuthCookie = document.cookie.includes('auth-session=')
      
      if (hasAuthCookie) {
        // In a real app, you'd make an API call to verify the session
        const response = await authAPI.checkAuthStatus()
        setUser(response.data.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      // Clear any invalid cookies
      document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    try {
      const response = await authAPI.login(email, password)
      
      if (response.data.user) {
        setUser(response.data.user)
        setIsLoading(false)
        return { success: true }
      } else {
        setIsLoading(false)
        return { success: false, error: "Invalid response from server" }
      }
    } catch (error: any) {
      setIsLoading(false)
      const errorMessage = error.response?.data?.message || error.message || "Login failed"
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    geoCoordinates: {
      latitude: number
      longitude: number
    }
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    try {
      const response = await authAPI.register(userData)
      
      if (response.data.user) {
        setUser(response.data.user)
        setIsLoading(false)
        return { success: true }
      } else {
        setIsLoading(false)
        return { success: false, error: "Invalid response from server" }
      }
    } catch (error: any) {
      setIsLoading(false)
      const errorMessage = error.response?.data?.message || error.message || "Registration failed"
      return { success: false, error: errorMessage }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout API call failed:", error)
      // Continue with local logout even if API call fails
    } finally {
      setUser(null)
      // Cookie is cleared in the API call
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
