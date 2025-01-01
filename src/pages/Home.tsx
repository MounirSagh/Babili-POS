import React, { useState } from 'react';
import Cart from '../components/Cart';
import Listings from '../components/Listings';

function Home() {
  const [cart, setCart] = useState([]);

  // Add item to cart
  const addToCart = (item: any) => {
    setCart((prevCart: any) => {
      const existingItem = prevCart.find((cartItem : any) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem : any) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Update quantity of items in the cart
  const updateQuantity = (itemId : any, increment : any) => {
    setCart((prevCart : any) =>
      prevCart
        .map((item : any) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + increment }
            : item
        )
        .filter((item : any) => item.quantity > 0) // Remove items with quantity 0
    );
  };

  return (
    <div className="flex p-2 gap-8">
      <div className="w-1/3">
        <Cart cart={cart} updateQuantity={updateQuantity} />
      </div>
      <div className="w-2/3">
        <Listings addToCart={addToCart} />
      </div>
    </div>
  );
}

export default Home;