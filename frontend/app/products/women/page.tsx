"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters, FilterState } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Filter } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

// Extended mock products data with brands - All products (same as men's page)
const allProducts = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "stylehub",
    isNew: true,
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "premium",
    isNew: false,
  },
  {
    id: 3,
    name: "Summer Floral Dress",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "casual",
    isNew: true,
  },
  {
    id: 4,
    name: "Casual Hoodie",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "casual",
    isNew: false,
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "vintage",
    isNew: true,
  },
  {
    id: 6,
    name: "Pleated Skirt",
    price: 45.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "formal",
    isNew: false,
  },
  {
    id: 7,
    name: "Knit Sweater",
    price: 65.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "premium",
    isNew: true,
  },
  {
    id: 8,
    name: "Cargo Pants",
    price: 55.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "casual",
    isNew: false,
  },
  {
    id: 9,
    name: "Leather Boots",
    price: 129.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "shoes",
    brand: "premium",
    isNew: true,
  },
  {
    id: 10,
    name: "Silk Blouse",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "formal",
    isNew: false,
  },
  {
    id: 11,
    name: "Athletic Shorts",
    price: 34.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "athletic",
    isNew: true,
  },
  {
    id: 12,
    name: "Maxi Dress",
    price: 95.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "casual",
    isNew: false,
  },
  {
    id: 13,
    name: "Polo Shirt",
    price: 39.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "stylehub",
    isNew: true,
  },
  {
    id: 14,
    name: "Cardigan",
    price: 69.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "premium",
    isNew: false,
  },
  {
    id: 15,
    name: "Chino Pants",
    price: 54.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "formal",
    isNew: true,
  },
  {
    id: 16,
    name: "Wrap Dress",
    price: 74.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "stylehub",
    isNew: false,
  },
  {
    id: 17,
    name: "Bomber Jacket",
    price: 99.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "vintage",
    isNew: true,
  },
  {
    id: 18,
    name: "Pencil Skirt",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "formal",
    isNew: false,
  },
  {
    id: 19,
    name: "Flannel Shirt",
    price: 44.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "casual",
    isNew: true,
  },
  {
    id: 20,
    name: "Blazer",
    price: 119.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "formal",
    isNew: false,
  },
  {
    id: 21,
    name: "Sweatshirt",
    price: 54.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "athletic",
    isNew: true,
  },
  {
    id: 22,
    name: "Midi Skirt",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "stylehub",
    isNew: false,
  },
  {
    id: 23,
    name: "Track Pants",
    price: 42.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "athletic",
    isNew: true,
  },
  {
    id: 24,
    name: "Cocktail Dress",
    price: 149.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "formal",
    isNew: false,
  },
  {
    id: 25,
    name: "Henley Shirt",
    price: 36.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "casual",
    isNew: true,
  },
  {
    id: 26,
    name: "Trench Coat",
    price: 189.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "premium",
    isNew: false,
  },
  {
    id: 27,
    name: "Joggers",
    price: 39.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "athletic",
    isNew: true,
  },
  {
    id: 28,
    name: "Jumpsuit",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "casual",
    isNew: false,
  },
  {
    id: 29,
    name: "Tank Top",
    price: 19.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    brand: "athletic",
    isNew: true,
  },
  {
    id: 30,
    name: "Evening Gown",
    price: 299.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    brand: "formal",
    isNew: false,
  },
  {
    id: 31,
    name: "Sneakers",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "shoes",
    brand: "athletic",
    isNew: false,
  },
  {
    id: 32,
    name: "Dress Shoes",
    price: 159.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "shoes",
    brand: "formal",
    isNew: true,
  },
  {
    id: 33,
    name: "Sunglasses",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "accessories",
    brand: "premium",
    isNew: false,
  },
  {
    id: 34,
    name: "Leather Belt",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "accessories",
    brand: "stylehub",
    isNew: true,
  },
  {
    id: 35,
    name: "Watch",
    price: 199.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "accessories",
    brand: "premium",
    isNew: false,
  },
]

const PRODUCTS_PER_PAGE = 15

// Initial filters with women category pre-selected
const initialFilters: FilterState = {
  categories: ["women"], // Pre-filter for women's products
  brands: [],
  priceRange: [0, 300]
}

export default function WomenProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  
  const currentPage = Number(searchParams.get('page')) || 1

  // Filter products based on current filters (always include women's category)
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Always filter for women's category, but allow additional categories
      const categoryFilter = filters.categories.length === 0 
        ? product.category === "women" 
        : filters.categories.includes(product.category)
      
      if (!categoryFilter) {
        return false
      }
      
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }
      
      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }
      
      return true
    })
  }, [filters])

  const totalProducts = filteredProducts.length
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
  
  // Calculate products for current page
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/products/women?${params.toString()}`)
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false)
      // Scroll to top of products
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    // Ensure women category is always included
    const updatedFilters = {
      ...newFilters,
      categories: newFilters.categories.includes("women") 
        ? newFilters.categories 
        : [...newFilters.categories, "women"]
    }
    
    setFilters(updatedFilters)
    // Reset to page 1 when filters change
    if (currentPage !== 1) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', '1')
      router.push(`/products/women?${params.toString()}`)
    }
  }

  const handleClearFilters = () => {
    setFilters(initialFilters) // Reset to initial filters (keeps women category)
    // Reset to page 1 when clearing filters
    if (currentPage !== 1) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', '1')
      router.push(`/products/women?${params.toString()}`)
    }
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Women's Collection</h1>
        <p className="text-muted-foreground max-w-[600px]">
          Explore our premium women's clothing and accessories
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-4">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              productCount={totalProducts}
              categoryFilter="women" // Pass category context
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {(filters.categories.length - 1 + filters.brands.length + 
                    (filters.priceRange[0] > 0 || filters.priceRange[1] < 300 ? 1 : 0)) > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                      {filters.categories.length - 1 + filters.brands.length + 
                       (filters.priceRange[0] > 0 || filters.priceRange[1] < 300 ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Women's Collection Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ProductFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                    productCount={totalProducts}
                    categoryFilter="women"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <ProductGrid 
            products={currentProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            totalProducts={totalProducts}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />

          {/* No Results Message */}
          {!isLoading && totalProducts === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Filter className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No women's products found</h3>
                <p>Try adjusting your filters to see more results.</p>
              </div>
              <Button onClick={handleClearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
