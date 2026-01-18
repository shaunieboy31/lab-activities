import React from 'react'

export default function Cart({ items, onRemove, onUpdateQuantity, onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Shopping Cart</h2>
        <p>Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="cart">
      <h2>Shopping Cart ({items.length} items)</h2>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.productId} className="cart-item">
            <img src={item.imageUrl} alt={item.name} />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p className="cart-item-price">₱{item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-actions">
              <button onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}>+</button>
            </div>
            <button className="btn-remove" onClick={() => onRemove(item.productId)}>×</button>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total: ₱{total.toFixed(2)}</h3>
        <button className="btn-checkout" onClick={onCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  )
}
