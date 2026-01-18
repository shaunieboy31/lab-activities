import React, { useState } from 'react'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import './styles.css'

export default function App() {
  const [cartItems, setCartItems] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)

  const addToCart = (product) => {
    const existing = cartItems.find(item => item.productId === product.id)
    
    if (existing) {
      setCartItems(cartItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCartItems([...cartItems, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      }])
    }
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    setCartItems(cartItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const handleCheckoutSuccess = () => {
    setCartItems([])
    setShowCheckout(false)
  }

  if (showCheckout) {
    return (
      <div className="container">
        <Checkout
          cartItems={cartItems}
          onSuccess={handleCheckoutSuccess}
          onCancel={() => setShowCheckout(false)}
        />
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <h1>🛍️ Mini E-Commerce</h1>
        <p>Shop with GCash QR Payment</p>
      </header>

      <div className="main-content">
        <div className="products-section">
          <h2>Products</h2>
          <ProductList onAddToCart={addToCart} />
        </div>

        <div className="cart-section">
          <Cart
            items={cartItems}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onCheckout={() => setShowCheckout(true)}
          />
        </div>
      </div>
    </div>
  )
}
