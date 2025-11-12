'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  category: string
  rating: number
  inStock: boolean
}

export default function MerchPage() {
  const [cart, setCart] = useState<{[key: string]: number}>({})
  const [liked, setLiked] = useState<string[]>([])
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const products: Product[] = [
    { id: '1', name: 'Classic Tee', price: 4500, category: 'shirts', rating: 4.8, inStock: true },
    { id: '2', name: 'Warrior Cap', price: 2500, category: 'caps', rating: 4.9, inStock: true },
    { id: '3', name: 'Performance Shorts', price: 6500, category: 'shorts', rating: 4.7, inStock: true },
    { id: '4', name: 'Hoodie', price: 9000, category: 'hoodies', rating: 4.9, inStock: true },
    { id: '5', name: 'Training Socks Pack', price: 3000, category: 'accessories', rating: 4.6, inStock: true },
    { id: '6', name: 'Water Bottle', price: 3500, category: 'accessories', rating: 4.8, inStock: true },
    { id: '7', name: 'Gym Bag', price: 8500, category: 'bags', rating: 4.7, inStock: true },
    { id: '8', name: 'Wristband Set', price: 2000, category: 'accessories', rating: 4.9, inStock: false },
  ]

  const categories = ['all', ...new Set(products.map(p => p.category))]
  const filteredProducts = filterCategory === 'all' ? products : products.filter(p => p.category === filterCategory)
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)

  const toggleCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const toggleLike = (productId: string) => {
    setLiked(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-naija-green-600 rounded-lg flex items-center justify-center shadow-md overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="font-bold text-gray-900 hidden sm:inline">Naija Ninja</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/leaderboard" className="text-gray-600 hover:text-gray-900">Leaderboard</Link>
            <Link href="/participants" className="text-gray-600 hover:text-gray-900">Participants</Link>
            <Link href="/merch" className="text-naija-green-600">Shop</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          </div>
          <div className="relative">
            <ShoppingBag size={24} className="text-naija-green-600" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">Exclusive Naija Ninja branded apparel</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex overflow-x-auto gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                filterCategory === cat
                  ? 'bg-naija-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition">
              {/* Product Image Placeholder */}
              <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 aspect-square flex items-center justify-center">
                <span className="text-4xl opacity-40">📦</span>
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white font-bold text-sm text-center px-2">Out of Stock</p>
                  </div>
                )}
                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:shadow-lg transition"
                >
                  <Heart
                    size={18}
                    className={liked.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p className="text-xs font-bold text-naija-green-600 uppercase mb-1">{product.category}</p>
                <h3 className="font-bold text-gray-900 mb-2 text-sm line-clamp-2">{product.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xs">
                        {i < Math.floor(product.rating) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-gray-900">₦{product.price.toLocaleString()}</p>
                  <button
                    onClick={() => toggleCart(product.id)}
                    disabled={!product.inStock}
                    className={`px-3 py-1 rounded text-sm font-semibold transition ${
                      product.inStock
                        ? 'bg-naija-green-600 text-white hover:bg-naija-green-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}