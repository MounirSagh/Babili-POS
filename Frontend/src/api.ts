import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api", // Update this to your backend URL
  });
  
// Update the endpoint in api.ts
export const fetchProducts = async () => {
    try {
      const response = await api.get("/getproducts"); // This should match the backend route '/getproducts'
      return response.data; // This will return the list of products
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };
  