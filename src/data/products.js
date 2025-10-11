
import React, { useState, useEffect } from 'react';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      
      try {
        
        const response = await fetch(
          `${backendURL}products/discounted`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Discounted & Available Products</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map((product) => (
          <div key={product.id} style={{ marginBottom: '2rem' }}>
            <h2>{product.title}</h2>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            <p>Discount: {product.discount}</p>
            <div>
              <img
                src={product.images.light}
                alt={product.title}
                style={{ maxWidth: '200px' }}
              />
            </div>
            {product.features && product.features.length > 0 && (
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
}
