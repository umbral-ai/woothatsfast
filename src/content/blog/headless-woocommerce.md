---
title: "Building a Headless WooCommerce Store with Next.js"
description: "Learn how to create a high-performance headless WooCommerce store using Next.js, including setup, optimization, and best practices."
pubDate: 2024-01-25
author: "Daniel Snell"
category: "Development"
featured: false
---

## Introduction

Building a headless WooCommerce store with Next.js can significantly improve performance and user experience. Here's a comprehensive guide to implementing this modern architecture.

## Initial Setup

### Next.js Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-wordpress-domain.com'],
  },
  async rewrites() {
    return [
      {
        source: '/products/:path*',
        destination: '/api/products/:path*',
      },
    ];
  },
}
```

### API Configuration

```typescript
// lib/woocommerce.ts
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const woocommerce = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3"
});

export async function fetchProducts(query = {}) {
  try {
    const { data } = await woocommerce.get("products", query);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
```

## Product Listing Implementation

```typescript
// pages/products/index.tsx
import { GetStaticProps } from 'next';
import { fetchProducts } from '@/lib/woocommerce';
import ProductGrid from '@/components/ProductGrid';

export default function ProductsPage({ products }) {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await fetchProducts({
    per_page: 12,
    status: 'publish',
  });

  return {
    props: {
      products,
    },
    revalidate: 60, // Revalidate every minute
  };
};
```

## Product Component

```typescript
// components/Product.tsx
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface ProductProps {
  product: {
    id: number;
    name: string;
    price: string;
    images: Array<{ src: string }>;
    permalink: string;
  };
}

export default function Product({ product }: ProductProps) {
  return (
    <div className="group relative">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
        <Image
          src={product.images[0]?.src}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="group-hover:opacity-75 transition-opacity"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href={product.permalink}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </a>
          </h3>
        </div>
        <p className="text-sm font-medium text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
}
```

## Cart Implementation

```typescript
// lib/cart.ts
import create from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const useCart = create<CartStore>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ items: [] }),
}));

export default useCart;
```

## Checkout Process

```typescript
// components/Checkout.tsx
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { createOrder } from '@/lib/woocommerce';

export default function Checkout() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
  });
  const { items, clearCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const order = await createOrder({
        payment_method: 'stripe',
        payment_method_title: 'Credit Card',
        set_paid: false,
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          address_1: formData.address,
        },
        line_items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });

      // Redirect to payment
      window.location.href = order.payment_url;
      
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      {/* Form fields */}
    </form>
  );
}
```

## Performance Optimization

### API Route Caching

```typescript
// pages/api/products/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { woocommerce } from '@/lib/woocommerce';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Set cache headers
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  try {
    const { data } = await woocommerce.get(`products/${id}`);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
}
```

### Image Optimization

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';

export default function OptimizedImage({ src, alt, ...props }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        {...props}
        onLoadingComplete={() => setIsLoading(false)}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
      />
    </div>
  );
}
```

## State Management

```typescript
// lib/store.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  cart: CartItem[];
  user: User | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  setUser: (user: User) => void;
  clearCart: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      user: null,
      addToCart: (item) =>
        set((state) => ({ cart: [...state.cart, item] })),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      setUser: (user) => set({ user }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'store',
    }
  )
);

export default useStore;
```

## Conclusion

Building a headless WooCommerce store with Next.js provides excellent performance and developer experience. This implementation gives you a solid foundation for building a modern e-commerce experience.

Remember to:
- Implement proper caching strategies
- Optimize images and assets
- Handle state management effectively
- Ensure secure checkout process
- Monitor performance metrics
