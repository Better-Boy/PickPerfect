import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.stylehub.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies to be sent with requests
})

// Request interceptor - no longer need to add auth token manually
api.interceptors.request.use(
  (config) => {
    // Cookies are automatically included with withCredentials: true
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear any auth cookies
      document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Mock data for orders
const MOCK_ORDERS = [
  {
    id: "ORD-2024-001",
    orderNumber: "STH-240108-001",
    status: "delivered",
    orderDate: "2024-01-08T10:30:00Z",
    deliveryDate: "2024-01-12T14:20:00Z",
    total: 159.97,
    shippingAddress: {
      name: "John Doe",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "US"
    },
    items: [
      {
        id: 1,
        name: "Classic White T-Shirt",
        price: 29.99,
        quantity: 2,
        size: "M",
        color: "White",
        image: "/placeholder.svg?height=400&width=300",
        category: "men"
      },
      {
        id: 3,
        name: "Summer Floral Dress",
        price: 79.99,
        quantity: 1,
        size: "L",
        color: "Floral Print",
        image: "/placeholder.svg?height=400&width=300",
        category: "women"
      }
    ],
    tracking: {
      carrier: "FedEx",
      trackingNumber: "1234567890123456",
      status: "delivered"
    }
  },
  {
    id: "ORD-2024-002",
    orderNumber: "STH-240115-002",
    status: "shipped",
    orderDate: "2024-01-15T16:45:00Z",
    estimatedDelivery: "2024-01-20T18:00:00Z",
    total: 109.98,
    shippingAddress: {
      name: "John Doe",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "US"
    },
    items: [
      {
        id: 2,
        name: "Slim Fit Jeans",
        price: 59.99,
        quantity: 1,
        size: "32",
        color: "Blue",
        image: "/placeholder.svg?height=400&width=300",
        category: "men"
      },
      {
        id: 4,
        name: "Casual Hoodie",
        price: 49.99,
        quantity: 1,
        size: "L",
        color: "Gray",
        image: "/placeholder.svg?height=400&width=300",
        category: "men"
      }
    ],
    tracking: {
      carrier: "UPS",
      trackingNumber: "1Z999AA1234567890",
      status: "in_transit"
    }
  },
  {
    id: "ORD-2024-003",
    orderNumber: "STH-240122-003",
    status: "processing",
    orderDate: "2024-01-22T09:15:00Z",
    estimatedDelivery: "2024-01-28T18:00:00Z",
    total: 89.99,
    shippingAddress: {
      name: "John Doe",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "US"
    },
    items: [
      {
        id: 5,
        name: "Denim Jacket",
        price: 89.99,
        quantity: 1,
        size: "M",
        color: "Blue",
        image: "/placeholder.svg?height=400&width=300",
        category: "men"
      }
    ],
    tracking: null
  }
]

// Mock recommended products based on user preferences - now 5 products
const MOCK_RECOMMENDED_PRODUCTS = [
  {
    id: 6,
    name: "Premium Cotton Polo",
    price: 45.99,
    originalPrice: 59.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: false,
    discount: 23,
    reason: "Similar to your Classic White T-Shirt"
  },
  {
    id: 7,
    name: "Relaxed Fit Chinos",
    price: 69.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: true,
    reason: "Perfect match with your Slim Fit Jeans"
  },
  {
    id: 8,
    name: "Lightweight Cardigan",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    isNew: false,
    reason: "Complements your Summer Floral Dress"
  },
  {
    id: 9,
    name: "Athletic Joggers",
    price: 39.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: false,
    reason: "Goes great with your Casual Hoodie"
  },
  {
    id: 10,
    name: "Vintage Denim Shirt",
    price: 54.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: true,
    reason: "Matches your Denim Jacket style"
  }
]

// Mock location-based deals - using existing product IDs from the main products array
const MOCK_LOCATION_DEALS = [
  {
    id: 4, // Casual Hoodie - existing product
    name: "Casual Hoodie",
    price: 39.99,
    originalPrice: 49.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: false,
    discount: 20,
    warehouse: {
      location: "San Francisco Warehouse",
      distance: 2.5,
      estimatedDelivery: "Same day delivery"
    },
    dealReason: "Local warehouse clearance",
    savingsAmount: 10.00
  },
  {
    id: 9, // Leather Boots - existing product
    name: "Leather Boots",
    price: 99.99,
    originalPrice: 129.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "shoes",
    isNew: true,
    discount: 23,
    warehouse: {
      location: "Oakland Distribution Center",
      distance: 8.2,
      estimatedDelivery: "Next day delivery"
    },
    dealReason: "Overstock from nearby facility",
    savingsAmount: 30.00
  },
  {
    id: 31, // Sneakers - existing product
    name: "Sneakers",
    price: 69.99,
    originalPrice: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "shoes",
    isNew: false,
    discount: 22,
    warehouse: {
      location: "San Jose Fulfillment",
      distance: 12.1,
      estimatedDelivery: "1-2 day delivery"
    },
    dealReason: "End of season clearance",
    savingsAmount: 20.00
  },
  {
    id: 35, // Watch - existing product
    name: "Watch",
    price: 149.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "accessories",
    isNew: false,
    discount: 25,
    warehouse: {
      location: "San Francisco Warehouse",
      distance: 2.5,
      estimatedDelivery: "Same day delivery"
    },
    dealReason: "Local exclusive offer",
    savingsAmount: 50.00
  },
  {
    id: 3, // Summer Floral Dress - existing product
    name: "Summer Floral Dress",
    price: 59.99,
    originalPrice: 79.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    isNew: true,
    discount: 25,
    warehouse: {
      location: "Berkeley Storage",
      distance: 6.8,
      estimatedDelivery: "Next day delivery"
    },
    dealReason: "Warehouse consolidation sale",
    savingsAmount: 20.00
  },
  {
    id: 11, // Athletic Shorts - existing product
    name: "Athletic Shorts",
    price: 24.99,
    originalPrice: 34.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: true,
    discount: 29,
    warehouse: {
      location: "Fremont Logistics Hub",
      distance: 15.3,
      estimatedDelivery: "2-3 day delivery"
    },
    dealReason: "Regional promotion",
    savingsAmount: 10.00
  }
]

// Mock API responses for development
const MOCK_RESPONSES = {
  login: {
    success: {
      data: {
        user: {
          id: "user_123",
          email: "user@example.com",
          name: "John Doe",
          location: {
            geoCoordinates: {
              latitude: 37.7749,
              longitude: -122.4194
            }
          }
        }
      },
      message: "Login successful"
    },
    error: {
      message: "Invalid credentials"
    }
  },
  register: {
    success: {
      data: {
        user: {
          id: "user_456",
          email: "newuser@example.com",
          name: "Jane Smith",
          location: {
            geoCoordinates: {
              latitude: 34.0522,
              longitude: -118.2437
            }
          }
        }
      },
      message: "Registration successful"
    },
    error: {
      message: "User already exists"
    }
  },
  orders: {
    success: {
      data: {
        orders: MOCK_ORDERS,
        pagination: {
          page: 1,
          limit: 10,
          total: MOCK_ORDERS.length,
          totalPages: 1
        }
      }
    }
  },
  recommendations: {
    success: {
      data: {
        products: MOCK_RECOMMENDED_PRODUCTS,
        reason: "Based on your purchase history and preferences"
      }
    }
  },
  locationDeals: {
    success: {
      data: {
        deals: MOCK_LOCATION_DEALS,
        userLocation: "San Francisco, CA",
        totalSavings: MOCK_LOCATION_DEALS.reduce((sum, deal) => sum + deal.savingsAmount, 0)
      }
    }
  }
}

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      console.log('🔄 Making login API call to:', `${api.defaults.baseURL}/auth/login`)
      console.log('📤 Request payload:', { email, password: '***' })
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation logic
      const isValidCredentials = email.includes('@') && password.length >= 6
      
      if (isValidCredentials) {
        const response = {
          data: {
            ...MOCK_RESPONSES.login.success.data,
            user: {
              ...MOCK_RESPONSES.login.success.data.user,
              email,
              name: email.split('@')[0]
            }
          },
          status: 200,
          statusText: 'OK'
        }
        
        console.log('✅ Login API response:', response.data)
        // Note: In real implementation, server would set httpOnly cookies
        // For demo, we'll simulate this by setting a regular cookie
        document.cookie = `auth-session=mock_session_${Date.now()}; path=/; max-age=86400; samesite=strict`
        
        return response
      } else {
        throw new Error(MOCK_RESPONSES.login.error.message)
      }
      
    } catch (error) {
      console.error('❌ Login API error:', error)
      throw error
    }
  },

  register: async (userData: {
    name: string
    email: string
    password: string
    geoCoordinates: {
      latitude: number
      longitude: number
    }
  }) => {
    try {
      console.log('🔄 Making register API call to:', `${api.defaults.baseURL}/auth/register`)
      console.log('📤 Request payload:', { ...userData, password: '***' })
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Mock validation logic
      const isValidData = userData.name && userData.email.includes('@') && userData.password.length >= 6 && userData.geoCoordinates
      
      if (isValidData) {
        const response = {
          data: {
            ...MOCK_RESPONSES.register.success.data,
            user: {
              ...MOCK_RESPONSES.register.success.data.user,
              email: userData.email,
              name: userData.name,
              location: {
                geoCoordinates: userData.geoCoordinates
              }
            }
          },
          status: 201,
          statusText: 'Created'
        }
        
        console.log('✅ Register API response:', response.data)
        console.log('📍 Geo coordinates received:', userData.geoCoordinates)
        
        // Note: In real implementation, server would set httpOnly cookies
        // For demo, we'll simulate this by setting a regular cookie
        document.cookie = `auth-session=mock_session_${Date.now()}; path=/; max-age=86400; samesite=strict`
        
        return response
      } else {
        throw new Error(MOCK_RESPONSES.register.error.message)
      }
      
    } catch (error) {
      console.error('❌ Register API error:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      console.log('🔄 Making logout API call to:', `${api.defaults.baseURL}/auth/logout`)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const response = {
        data: { message: 'Logout successful' },
        status: 200,
        statusText: 'OK'
      }
      
      console.log('✅ Logout API response:', response.data)
      
      // Clear the auth cookie
      document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      return response
      
    } catch (error) {
      console.error('❌ Logout API error:', error)
      throw error
    }
  },

  // Add a new function to check auth status
  checkAuthStatus: async () => {
    try {
      console.log('🔄 Making auth status check API call')
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check if auth cookie exists
      const hasAuthCookie = document.cookie.includes('auth-session=')
      
      if (hasAuthCookie) {
        const response = {
          data: {
            user: {
              id: "user_123",
              email: "user@example.com",
              name: "John Doe",
              location: {
                geoCoordinates: {
                  latitude: 37.7749,
                  longitude: -122.4194
                }
              }
            }
          },
          status: 200,
          statusText: 'OK'
        }
        
        console.log('✅ Auth status check response:', response.data)
        return response
      } else {
        throw new Error('Not authenticated')
      }
      
    } catch (error) {
      console.error('❌ Auth status check error:', error)
      throw error
    }
  }
}

// Orders API functions
export const ordersAPI = {
  getUserOrders: async (page: number = 1, limit: number = 10) => {
    try {
      console.log('🔄 Making get orders API call to:', `${api.defaults.baseURL}/orders`)
      console.log('📤 Request params:', { page, limit })
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const response = {
        data: MOCK_RESPONSES.orders.success.data,
        status: 200,
        statusText: 'OK'
      }
      
      console.log('✅ Orders API response:', response.data)
      return response
      
      // Real API call would be:
      // return await api.get(`/orders?page=${page}&limit=${limit}`)
      
    } catch (error) {
      console.error('❌ Orders API error:', error)
      throw error
    }
  },

  getOrderById: async (orderId: string) => {
    try {
      console.log('🔄 Making get order by ID API call to:', `${api.defaults.baseURL}/orders/${orderId}`)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const order = MOCK_ORDERS.find(o => o.id === orderId)
      
      if (order) {
        const response = {
          data: { order },
          status: 200,
          statusText: 'OK'
        }
        
        console.log('✅ Order by ID API response:', response.data)
        return response
      } else {
        throw new Error('Order not found')
      }
      
      // Real API call would be:
      // return await api.get(`/orders/${orderId}`)
      
    } catch (error) {
      console.error('❌ Order by ID API error:', error)
      throw error
    }
  }
}

// Recommendations API functions
export const recommendationsAPI = {
  getRecommendedProducts: async () => {
    try {
      console.log('🔄 Making get recommendations API call to:', `${api.defaults.baseURL}/recommendations`)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const response = {
        data: MOCK_RESPONSES.recommendations.success.data,
        status: 200,
        statusText: 'OK'
      }
      
      console.log('✅ Recommendations API response:', response.data)
      return response
      
      // Real API call would be:
      // return await api.get('/recommendations')
      
    } catch (error) {
      console.error('❌ Recommendations API error:', error)
      throw error
    }
  }
}

// Location-based deals API functions
export const dealsAPI = {
  getLocationBasedDeals: async (userLocation?: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }) => {
    try {
      console.log('🔄 Making get location deals API call to:', `${api.defaults.baseURL}/deals/location`)
      console.log('📤 User location:', userLocation)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // In a real app, you would filter deals based on user location
      // For now, we'll return all mock deals
      const response = {
        data: {
          ...MOCK_RESPONSES.locationDeals.success.data,
          userLocation: userLocation ? `${userLocation.city}, ${userLocation.state.toUpperCase()}` : "Unknown"
        },
        status: 200,
        statusText: 'OK'
      }
      
      console.log('✅ Location deals API response:', response.data)
      return response
      
      // Real API call would be:
      // return await api.post('/deals/location', { location: userLocation })
      
    } catch (error) {
      console.error('❌ Location deals API error:', error)
      throw error
    }
  }
}

export default api
