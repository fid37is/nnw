// File: app/merch/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingBag, Loader2, X, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import styles from '@/components/sections/nnw/nnw.module.css'
import mStyles from '@/components/module/merch.module.css'
import Ticker from '@/components/sections/nnw/Ticker'
import Nav from '@/components/sections/nnw/Nav'
import Footer from '@/components/sections/nnw/Footer'
import { MERCH_HERO_IMG } from '@/components/sections/nnw/data'

interface MerchItem {
  id: string
  name: string
  price: number
  category: string
  rating: number
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

const TICKER_ITEMS = [
  "NIGERIA'S NEXT WARRIOR · A WLA COMPANY",
  'SEASON 1 MERCH · NOW AVAILABLE',
  'DEMO STOREFRONT — CHECKOUT SUBMITS A REAL ORDER',
]

export default function MerchPage() {
  const [merchItems, setMerchItems] = useState<MerchItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [liked, setLiked] = useState<string[]>([])
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
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
    loadMerchItems()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      setUserId(session.user.id)

      const { data: userData } = await supabase
        .from('users')
        .select('full_name, email, phone')
        .eq('id', session.user.id)
        .single()

      setCheckoutForm(prev => ({
        ...prev,
        fullName: userData?.full_name || '',
        email: userData?.email || session.user.email || '',
        phone: userData?.phone || '',
      }))
    } catch (err) {
      console.error('Auth check error:', err)
    }
  }

  const loadMerchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('merch_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error.message, '| code:', error.code)
        toast.error(`Failed to load items: ${error.message}`)
        return
      }

      setMerchItems(data ?? [])
    } catch (err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err)
      console.error('Unexpected error loading merch items:', message)
      toast.error('Failed to load items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(merchItems.map(p => p.category))]
  const filteredProducts = filterCategory === 'all'
    ? merchItems
    : merchItems.filter(p => p.category === filterCategory)

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addToCart = async (product: MerchItem) => {
    setLoadingProductId(product.id)
    await new Promise(resolve => setTimeout(resolve, 300))
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast.success(`${product.name} added to cart`)
    setLoadingProductId(null)
  }

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.id === productId)
    setCart(prev => prev.filter(i => i.id !== productId))
    if (item) toast.success(`${item.name} removed from cart`)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item))
  }

  const toggleLike = (productId: string) => {
    const product = merchItems.find(p => p.id === productId)
    const isLiked = liked.includes(productId)
    setLiked(prev => isLiked ? prev.filter(id => id !== productId) : [...prev, productId])
    toast.success(isLiked ? `${product?.name} removed from favorites` : `${product?.name} added to favorites`)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    const { fullName, email, phone, address, city } = checkoutForm
    if (!fullName || !email || !phone || !address || !city) {
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

      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: userId || null,
          customer_name: fullName,
          customer_email: email,
          customer_phone: phone,
          customer_address: address,
          customer_city: city,
          payment_method: checkoutForm.paymentMethod,
          items: orderItems,
          total_amount: cartTotal,
          status: 'pending',
        }])
        .select()

      if (orderError) {
        console.error('Order error:', orderError.message)
        toast.error(`Failed to place order: ${orderError.message}`)
        return
      }

      const { error: emailError } = await supabase.functions.invoke('send-order-confirmation', {
        body: { to: email, customerName: fullName, orderItems, totalAmount: cartTotal, paymentMethod: checkoutForm.paymentMethod, address, city, phone },
      })
      if (emailError) console.error('Email error (non-blocking):', emailError)

      setCart([])
      setCheckoutOpen(false)
      setCartDrawerOpen(false)
      toast.success('Order placed! Check your email for confirmation.')
    } catch (err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err)
      console.error('Unexpected checkout error:', message)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className={styles.nnw}>
      <Ticker items={TICKER_ITEMS} />
      <Nav applyLabel="Get Notified" />

      <button onClick={() => setCartDrawerOpen(true)} className={mStyles['cart-fab']}>
        <ShoppingBag size={18} color="var(--navy)" />
        <span className={styles.mono} style={{ fontSize: 11.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--navy)' }}>Cart</span>
        {cartCount > 0 && <span className={mStyles['cart-fab-count']}>{cartCount}</span>}
      </button>

      <header className={mStyles['m-hero']} style={{ paddingTop: 200 }}>
        <div className={mStyles['m-hero-photo']}>
          <img src={MERCH_HERO_IMG} alt="Jerseys and apparel displayed on shelves and racks" />
        </div>
        <span className={styles['ghost-num']} style={{ fontSize: '26vw', bottom: '-9vw', right: '-6vw' }}>NNW</span>
        <div className={`${styles.wrap} ${mStyles['m-hero-content']}`}>
          <div className={styles['hero-badge']}>
            <span className={styles.dot} />
            <span className={styles.mono} style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>Season 1 Merch — Now Available</span>
          </div>
          <h1 className={styles.display} style={{ fontSize: 'clamp(38px, 7vw, 76px)', lineHeight: 0.9, color: 'var(--bone)', maxWidth: 720 }}>Wear the<br />colors.</h1>
          <p style={{ color: 'var(--ash)', fontSize: 15.5, lineHeight: 1.6, maxWidth: 480, marginTop: 18 }}>
            Official NNW gear for warriors and supporters. Zone jerseys, training kit, and everyday pieces - green, gold, and navy, done right.
          </p>
        </div>
      </header>

      {!loading && merchItems.length > 0 && (
        <div className={mStyles['m-filter-bar']}>
          <div className={`${styles.wrap} ${mStyles['m-filter-row']}`}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`${mStyles['m-chip']} ${filterCategory === cat ? mStyles.active : ''}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      <section style={{ padding: '48px 0 96px' }}>
        <div className={styles.wrap}>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '128px 0', gap: 16 }}>
              <Loader2 size={36} className="animate-spin" color="var(--green)" />
              <span className={styles.mono} style={{ fontSize: 12, color: 'rgba(var(--navy-rgb),0.5)' }}>Loading items…</span>
            </div>
          )}

          {!loading && merchItems.length === 0 && (
            <div className={mStyles['m-empty']}>
              <ShoppingBag size={48} style={{ opacity: 0.3 }} />
              <p>The shop is being stocked up — check back soon</p>
            </div>
          )}

          {!loading && merchItems.length > 0 && (
            filteredProducts.length === 0 ? (
              <div className={mStyles['m-empty']}>
                <ShoppingBag size={48} style={{ opacity: 0.3 }} />
                <p>No items in this category</p>
                <button onClick={() => setFilterCategory('all')} className={`${styles.btn} ${styles['btn-ghost-dark']}`} style={{ marginTop: 20, width: 'fit-content' }}>View All Items</button>
              </div>
            ) : (
              <div className={mStyles['m-grid']}>
                {filteredProducts.map(product => (
                  <div key={product.id} className={mStyles['m-card']}>
                    <div className={mStyles['m-card-photo']}>
                      {product.image_url && <img src={product.image_url} alt={product.name} />}
                      <button onClick={() => toggleLike(product.id)} className={mStyles['m-like-btn']}>
                        <Heart size={15} color={liked.includes(product.id) ? 'var(--error)' : 'var(--navy)'} fill={liked.includes(product.id) ? 'var(--error)' : 'none'} />
                      </button>
                    </div>
                    <div className={mStyles['m-card-body']}>
                      <div className={mStyles['m-card-cat']}>{product.category}</div>
                      <div className={mStyles['m-card-name']}>{product.name}</div>
                      <div className={mStyles['m-card-rating']}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: 'var(--gold)', fontSize: 11 }}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                        ))}
                        <span>{product.rating}</span>
                      </div>
                      <div className={mStyles['m-card-bottom']}>
                        <span className={mStyles['m-card-price']}>₦{product.price.toLocaleString()}</span>
                        <button onClick={() => addToCart(product)} disabled={loadingProductId === product.id} className={mStyles['m-add-btn']}>
                          {loadingProductId === product.id ? <Loader2 size={13} className="animate-spin" /> : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>

      {cartDrawerOpen && (
        <>
          <div className={mStyles['cart-overlay']} onClick={() => setCartDrawerOpen(false)} />
          <div className={mStyles['cart-drawer']}>
            <div className={mStyles['cart-header']}>
              <h2>Your Cart</h2>
              <button onClick={() => setCartDrawerOpen(false)} className={mStyles['cart-close']}><X size={20} /></button>
            </div>

            <div className={mStyles['cart-items']}>
              {cart.length === 0 ? (
                <div className={mStyles['cart-empty']}>
                  <ShoppingBag size={40} style={{ opacity: 0.4 }} />
                  <span className={styles.mono} style={{ fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Your cart is empty</span>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className={mStyles['cart-line']}>
                    <div style={{ flex: 1 }}>
                      <div className={mStyles['cart-line-name']}>{item.name}</div>
                      <div className={mStyles['cart-line-price']}>₦{item.price.toLocaleString()}</div>
                      <div className={mStyles['cart-line-controls']}>
                        <div className={mStyles['cart-line-qty']}>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                          <span className={styles.mono}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className={mStyles['cart-remove']}><X size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className={mStyles['cart-footer']}>
                <div className={mStyles['cart-row']}><span>Subtotal</span><span>₦{cartTotal.toLocaleString()}</span></div>
                <div className={mStyles['cart-row']}><span>Delivery</span><span>TBD</span></div>
                <div className={mStyles['cart-total-row']}><span>Total</span><span className={mStyles['cart-total-val']}>₦{cartTotal.toLocaleString()}</span></div>
                <button
                  onClick={() => { setCartDrawerOpen(false); setCheckoutOpen(true) }}
                  className={`${styles.btn} ${styles['btn-gold']}`}
                  style={{ width: '100%' }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {checkoutOpen && (
        <div className={mStyles['checkout-backdrop']}>
          <div className={mStyles['checkout-modal']}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div className={styles.display} style={{ fontSize: 22 }}>Checkout</div>
              <button onClick={() => setCheckoutOpen(false)} className={mStyles['cart-close']}><X size={20} /></button>
            </div>

            <form onSubmit={handleCheckout}>
              <div className={mStyles['checkout-summary']}>
                {cart.map(item => (
                  <div key={item.id} className={mStyles['checkout-summary-row']}>
                    <span>{item.name} ×{item.quantity}</span>
                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className={mStyles['checkout-summary-total']}><span>Total</span><span>₦{cartTotal.toLocaleString()}</span></div>
              </div>

              {[
                { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'John Doe' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'john@example.com' },
                { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+234 800 000 0000' },
                { label: 'Address', key: 'address', type: 'text', placeholder: '123 Main Street' },
                { label: 'City', key: 'city', type: 'text', placeholder: 'Lagos' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} className={styles['form-field']}>
                  <label>{label}</label>
                  <input
                    type={type}
                    value={checkoutForm[key as keyof CheckoutForm]}
                    onChange={e => setCheckoutForm({ ...checkoutForm, [key]: e.target.value })}
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <div className={styles['form-field']}>
                <label>Payment Method</label>
                {[
                  { value: 'pickup', label: 'Pay on Pickup' },
                  { value: 'delivery', label: 'Pay on Delivery' },
                  { value: 'card', label: 'Card Payment' },
                ].map(method => (
                  <label key={method.value} className={mStyles['pay-option']}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={checkoutForm.paymentMethod === method.value}
                      onChange={e => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value as CheckoutForm['paymentMethod'] })}
                    />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                <button type="button" onClick={() => setCheckoutOpen(false)} disabled={checkoutLoading} className={`${styles.btn} ${styles['btn-ghost-dark']}`} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={checkoutLoading} className={`${styles.btn} ${styles['btn-gold']}`} style={{ flex: 1 }}>
                  {checkoutLoading ? <><Loader2 size={15} className="animate-spin" /> Processing…</> : <><Mail size={15} /> Place Order</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}