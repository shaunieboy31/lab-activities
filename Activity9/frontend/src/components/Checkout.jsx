import React, { useState } from 'react'
import { createOrder } from '../api'

export default function Checkout({ cartItems, onSuccess, onCancel }) {
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [orderId, setOrderId] = useState(null)

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        customerName,
        customerEmail,
        customerPhone,
        items: cartItems,
      }

      const order = await createOrder(orderData)
      setQrCode(order.qrCodeData)
      setOrderId(order.id)
    } catch (error) {
      alert('Failed to create order: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (qrCode) {
    return (
      <div className="checkout-success">
        <h2>✓ Order Created Successfully!</h2>
        <p>Order ID: #{orderId}</p>
        <div className="qr-container">
          <h3>Scan to Pay with GCash</h3>
          <img src={qrCode} alt="GCash QR Code" className="qr-code" />
          <p className="qr-amount">Amount: ₱{total.toFixed(2)}</p>
        </div>
        <button className="btn-done" onClick={onSuccess}>Done</button>
      </div>
    )
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.productId} className="checkout-item">
            <span>{item.name} x {item.quantity}</span>
            <span>₱{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="checkout-total">
          <strong>Total:</strong>
          <strong>₱{total.toFixed(2)}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <h3>Customer Information</h3>
        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
        />
        <div className="checkout-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Processing...' : 'Generate GCash QR'}
          </button>
        </div>
      </form>
    </div>
  )
}
