import React, { useState, useEffect } from 'react'
import { getProducts } from '../api'

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading products...</div>

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.imageUrl} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-footer">
            <span className="price">₱{product.price.toFixed(2)}</span>
            <span className="stock">Stock: {product.stock}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="btn-add-cart"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      ))}
    </div>
  )
}
