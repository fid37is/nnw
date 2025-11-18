'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, ArrowLeft, Loader2, X, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import Navbar from '../navbar'

interface MerchItem {
  id: string
  name: string
  price: number
  category: string
  rating: number
  in_stock: boolean
  image_url: string
}

interface CartItem extends MerchItem {
  quantity: number
}

interface CheckoutForm {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  paymentMethod: 'pickup' | 'delivery' | 'card'
}

interface CheckoutDialog {
  isOpen: boolean
}

export default function MerchPage() {
  const [merchItems, setMerchItems] = useState<MerchItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [liked, setLiked] = useState<string[]>([])
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [checkoutDialog, setCheckoutDialog] = useState<CheckoutDialog>({
    isOpen: false,
  })
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'pickup',
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    loadMerchItems()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setLoading(false)
        setIsAuthenticated(false)
        return
      }

      setUserId(session.user.id)
      setIsAuthenticated(true)

      // Pre-fill form with user data
      const { data: userData } = await supabase
        .from('users')
        .select('full_name, email, phone')
        .eq('id', session.user.id)
        .single()

      if (userData) {
        setCheckoutForm(prev => ({
          ...prev,
          fullName: userData.full_name || '',
          email: userData.email || session.user.email || '',
          phone: userData.phone || '',
        }))
      } else {
        setCheckoutForm(prev => ({
          ...prev,
          email: session.user.email || '',
        }))
      }
    } catch (err) {
      console.error('Auth check error:', err)
    }
  }

  const loadMerchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('merch_items')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMerchItems(data || [])
    } catch (err) {
      console.error('Failed to load merch items:', err)
      toast.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(merchItems.map(p => p.category))]
  const filteredProducts = filterCategory === 'all'
    ? merchItems
    : merchItems.filter(p => p.category === filterCategory)

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const addToCart = async (product: MerchItem) => {
    setLoadingProductId(product.id)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      setCart(prev => {
        const existing = prev.find(item => item.id === product.id)
        if (existing) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return [...prev, { ...product, quantity: 1 }]
      })

      toast.success(`${product.name} added to cart`)
    } catch (error) {
      toast.error('Failed to add item to cart')
    } finally {
      setLoadingProductId(null)
    }
  }

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.id === productId)
    setCart(prev => prev.filter(item => item.id !== productId))
    toast.success(`${item?.name} removed from cart`)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const toggleLike = (productId: string) => {
    const product = merchItems.find(p => p.id === productId)
    setLiked(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )

    const isLiked = !liked.includes(productId)
    if (isLiked) {
      toast.success(`${product?.name} added to favorites`)
    } else {
      toast.success(`${product?.name} removed from favorites`)
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!checkoutForm.fullName || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address || !checkoutForm.city) {
      toast.error('Please fill in all fields')
      return
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setCheckoutLoading(true)
    try {
      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }))

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId || null,
            customer_name: checkoutForm.fullName,
            customer_email: checkoutForm.email,
            customer_phone: checkoutForm.phone,
            customer_address: checkoutForm.address,
            customer_city: checkoutForm.city,
            payment_method: checkoutForm.paymentMethod,
            items: orderItems,
            total_amount: cartTotal,
            status: 'pending',
          },
        ])
        .select()

      if (orderError) throw orderError

      // Send customer confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          to: checkoutForm.email,
          customerName: checkoutForm.fullName,
          orderItems: orderItems,
          totalAmount: cartTotal,
          paymentMethod: checkoutForm.paymentMethod,
          address: checkoutForm.address,
          city: checkoutForm.city,
          phone: checkoutForm.phone,
        },
      })

      if (emailError) {
        console.error('Email error (non-blocking):', emailError)
      }

      setCart([])
      setCheckoutDialog({ isOpen: false })
      setCartDrawerOpen(false)

      toast.success('Order placed successfully! Check your email for confirmation.')
    } catch (err) {
      console.error('Error placing order:', err)
      toast.error('Failed to place order')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Cart Icon - Top Right */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={() => setCartDrawerOpen(true)}
          className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition border border-gray-200 hover:border-naija-green-300"
        >
          <ShoppingBag size={24} className="text-naija-green-600" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <ShoppingBag size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Shop</h1>
          </div>
          <p className="text-gray-600">Exclusive Naija Ninja branded apparel</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex overflow-x-auto gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${filterCategory === cat
                  ? 'bg-naija-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No items available in this category</p>
            <button
              onClick={() => setFilterCategory('all')}
              className="mt-4 px-4 py-2 text-naija-green-600 font-semibold hover:text-naija-green-700"
            >
              View All Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition">
                {/* Product Image */}
                <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 aspect-square flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl opacity-40">📦</span>
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
                      onClick={() => addToCart(product)}
                      disabled={loadingProductId === product.id}
                      className="px-3 py-1 rounded text-sm font-semibold transition bg-naija-green-600 text-white hover:bg-naija-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {loadingProductId === product.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        'Add'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {cartDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
            onClick={() => setCartDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-6">
                  <ShoppingBag size={64} className="text-gray-300 mb-4" />
                  <p className="text-gray-600 text-center">Your cart is empty</p>
                  <p className="text-gray-500 text-sm text-center mt-2">Add items to get started</p>
                </div>
              ) : (
                <div className="space-y-3 p-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-naija-green-300 transition">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h4>
                        <p className="text-xs text-naija-green-600 font-semibold mb-2">₦{item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 border border-gray-300 rounded hover:bg-white transition text-sm"
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 border border-gray-300 rounded hover:bg-white transition text-sm"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900 font-semibold">₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="text-gray-900 font-semibold">TBD</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-naija-green-600">₦{cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => {
                    setCartDrawerOpen(false)
                    setCheckoutDialog({ isOpen: true })
                  }}
                  className="w-full px-4 py-3 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout Dialog */}
      {checkoutDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
              <button
                onClick={() => setCheckoutDialog({ isOpen: false })}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
                <div className="space-y-2 mb-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total:</span>
                    <span>₦{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={checkoutForm.fullName}
                  onChange={e => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={checkoutForm.email}
                  onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={checkoutForm.phone}
                  onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={checkoutForm.address}
                  onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  placeholder="123 Main Street"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={checkoutForm.city}
                  onChange={e => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                  placeholder="Lagos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <div className="space-y-2">
                  {[
                    { value: 'pickup', label: 'Pay on Pickup' },
                    { value: 'delivery', label: 'Pay on Delivery' },
                    { value: 'card', label: 'Card Payment' },
                  ].map(method => (
                    <label key={method.value} className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={checkoutForm.paymentMethod === method.value}
                        onChange={e => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value as any })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCheckoutDialog({ isOpen: false })}
                  disabled={checkoutLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="flex-1 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Place Order
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}