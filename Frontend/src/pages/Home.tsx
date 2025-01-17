import React, { useState, useEffect } from 'react';
import Cart from '../components/Cart';
import Listings from '../components/Listings';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);  // Initialize the cart state as an empty array


  const [products, setProducts] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  
  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get<any[]>('http://localhost:3000/api/products/getproducts');
      console.log('Products with subcategory:', response.data[0]); // Debug log
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch products by subcategory
  const fetchProductsBySubCategory = async (subcategoryId: string) => {
    try {
      if (!subcategoryId) {
        await fetchProducts();
        return;
      }
      const response = await axios.get<any[]>(`http://localhost:3000/api/products/getproductsbycategory/${subcategoryId}`);
      console.log('Products by category:', response.data[0]); // Debug log
      setProducts(response.data.length === 0 ? [] : response.data);
    } catch (error) {
      console.error('Error fetching products by subcategory:', error);
      setProducts([]);
    }
  };
  
  // Update the handleSubCategoryChange function
  const handleSubCategoryChange = (subcategoryId: string) => {
    setSelectedSubCategory(subcategoryId);
    fetchProductsBySubCategory(subcategoryId);
  };
  
    useEffect(() => {
      fetchProducts();
      fetchSubCategories();
    }, []);

    const fetchSubCategories = async () => {
      const response = await axios.get<any[]>('http://localhost:3000/api/subcategories/getsubcategories');
      setSubCategories(response.data);
    };

  // Update the addToCart function
const addToCart = (item: any) => {
  setCart((prevCart) => {
    const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      return prevCart.map((cartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    }
    return [...prevCart, { 
      ...item,
      subcategoryID: item.subcategoryID,
      quantity: 1 
    }];
  });
};

// Update the updateQuantity function
const updateQuantity = (itemId: string, increment: number) => {  // Changed types
  setCart((prevCart) =>
    prevCart
      .map((item) =>
        item._id === itemId  // Changed from id to _id
          ? { ...item, quantity: item.quantity + increment }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};


  return (
    <div className="flex flex-col p-2 gap-4">
      <div className="w-full bg-white p-2 rounded-lg shadow-sm">
        <div className="flex gap-4 items-center">
          {/* Search input first */}
          <div className="w-2/3">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Products
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search items..."
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category select second */}
          <div className="w-1/3">
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by SubCategory
            </label>
            <select 
              id="subcategory"
              value={selectedSubCategory}
              onChange={(e) => handleSubCategoryChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">All Products</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-1/3">
          <Cart cart={cart} updateQuantity={updateQuantity} />
        </div>
        <div className="w-2/3">
          <Listings 
            products={products} 
            addToCart={addToCart}
            search={search}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;

//hello
