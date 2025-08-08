"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Filter, RotateCcw } from 'lucide-react'
import { Separator } from "@/components/ui/separator"

export type FilterState = {
  categories: string[]
  brands: string[]
  priceRange: [number, number]
}

type ProductFiltersProps = {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  productCount: number
  categoryFilter?: string // Optional category context (e.g., "men", "women")
}

const CATEGORIES = [
  { id: 'men', label: "Men's Clothing", count: 20 },
  { id: 'women', label: "Women's Clothing", count: 18 },
  { id: 'accessories', label: 'Accessories', count: 8 },
  { id: 'shoes', label: 'Shoes', count: 12 },
]

const BRANDS = [
  { id: 'stylehub', label: 'StyleHub', count: 15 },
  { id: 'premium', label: 'Premium Collection', count: 12 },
  { id: 'casual', label: 'Casual Wear', count: 10 },
  { id: 'formal', label: 'Formal Attire', count: 8 },
  { id: 'athletic', label: 'Athletic Wear', count: 6 },
  { id: 'vintage', label: 'Vintage Style', count: 4 },
]

const PRICE_RANGE = {
  min: 0,
  max: 300,
  step: 5
}

export function ProductFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  productCount,
  categoryFilter 
}: ProductFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(filters.priceRange)

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    // If we have a category filter context, prevent unchecking the main category
    if (categoryFilter && categoryId === categoryFilter && !checked) {
      return // Don't allow unchecking the main category
    }

    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId)
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    })
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brandId]
      : filters.brands.filter(id => id !== brandId)
    
    onFiltersChange({
      ...filters,
      brands: newBrands
    })
  }

  const handlePriceRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]]
    setLocalPriceRange(newRange)
  }

  const handlePriceRangeCommit = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]]
    onFiltersChange({
      ...filters,
      priceRange: newRange
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    // Don't count the main category filter if it's the only one
    const extraCategories = categoryFilter 
      ? filters.categories.filter(cat => cat !== categoryFilter).length
      : filters.categories.length
    
    if (extraCategories > 0) count += extraCategories
    if (filters.brands.length > 0) count += filters.brands.length
    if (filters.priceRange[0] > PRICE_RANGE.min || filters.priceRange[1] < PRICE_RANGE.max) count += 1
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  // Filter categories to show based on context
  const visibleCategories = categoryFilter 
    ? CATEGORIES // Show all categories but with special handling
    : CATEGORIES

  return (
    <div className="w-full space-y-6">
      {/* Filter Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <CardTitle className="text-lg">Filters</CardTitle>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-8 px-2 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            {productCount} products found
          </p>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Filters</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {filters.categories
                .filter(categoryId => !categoryFilter || categoryId !== categoryFilter)
                .map(categoryId => {
                  const category = CATEGORIES.find(c => c.id === categoryId)
                  return (
                    <Badge key={categoryId} variant="secondary" className="text-xs">
                      {category?.label}
                      <button
                        onClick={() => handleCategoryChange(categoryId, false)}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </Badge>
                  )
                })}
              {filters.brands.map(brandId => {
                const brand = BRANDS.find(b => b.id === brandId)
                return (
                  <Badge key={brandId} variant="secondary" className="text-xs">
                    {brand?.label}
                    <button
                      onClick={() => handleBrandChange(brandId, false)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </Badge>
                )
              })}
              {(filters.priceRange[0] > PRICE_RANGE.min || filters.priceRange[1] < PRICE_RANGE.max) && (
                <Badge variant="secondary" className="text-xs">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  <button
                    onClick={() => onFiltersChange({
                      ...filters,
                      priceRange: [PRICE_RANGE.min, PRICE_RANGE.max]
                    })}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Category</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {visibleCategories.map((category) => {
            const isMainCategory = categoryFilter === category.id
            const isDisabled = isMainCategory && filters.categories.includes(category.id)
            
            return (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked as boolean)
                    }
                    disabled={isDisabled}
                  />
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className={`text-sm font-normal cursor-pointer ${
                      isMainCategory ? 'font-medium text-primary' : ''
                    }`}
                  >
                    {category.label}
                    {isMainCategory && (
                      <span className="ml-1 text-xs text-muted-foreground">(current)</span>
                    )}
                  </Label>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({category.count})
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Brand Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Brand</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {BRANDS.map((brand) => (
            <div key={brand.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={filters.brands.includes(brand.id)}
                  onCheckedChange={(checked) => 
                    handleBrandChange(brand.id, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {brand.label}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground">
                ({brand.count})
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="px-2">
            <Slider
              value={localPriceRange}
              onValueChange={handlePriceRangeChange}
              onValueCommit={handlePriceRangeCommit}
              max={PRICE_RANGE.max}
              min={PRICE_RANGE.min}
              step={PRICE_RANGE.step}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Min</span>
              <span className="font-medium">${localPriceRange[0]}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs text-muted-foreground">Max</span>
              <span className="font-medium">${localPriceRange[1]}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>${PRICE_RANGE.min}</span>
            <span>${PRICE_RANGE.max}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
