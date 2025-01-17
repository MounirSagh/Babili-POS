import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface OrderResponse {
  id: string;
  totalPrice: number;
  paymentMethod: string;
}

function Method({ cart }: any) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cash, setCash] = useState<string>('0'); // Default value set to '0'
  const total = cart.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const calculateChange = () => {
    if (!cash) return 0;
    return parseFloat(cash) - total;
  };

  const handleNumberClick = (num: string) => {
    setCash((prev) => (prev === '0' ? num : prev + num)); // Replace '0' with the first input
  };

  const handleClear = () => {
    setCash('0'); // Reset back to '0'
  };

  const handleBackspace = () => {
    setCash((prev) => {
      const updated = prev.slice(0, -1);
      return updated === '' ? '0' : updated; // Return '0' if the input is cleared
    });
  };

  const handlevalidate = async () => {
    try {
      const orderData = {
        userDetails: {
          userId: "pos-user",
          firstName: "POS",
          lastName: "Sale",
          email: "pos@example.com",
          phone: "N/A",
          city: "N/A",
          address: "N/A",
          postalCode: "N/A",
          country: "N/A"
        },
        cartItems: cart.map((item: any) => ({
          productId: item._id,
          quantity: item.quantity,
          REF: item.REF,
          price: item.price,
          attributes: item.attributes || [],
          subcategoryID: item.subcategoryID?._id
        })),
        totalPrice: total,
        paymentMethod: paymentMethod,
        status: "Approved",
        date: new Date()
      };

      const response = await axios.post<OrderResponse>('http://localhost:3000/api/order/create', orderData);
      
      // Clear the cart after successful order
      // You'll need to add setCart to your props
      // setCart([]);
      
      navigate('/success', { 
        state: { 
          orderId: response.data.id,
          total: total,
          paymentMethod: paymentMethod,
          change: paymentMethod === 'cash' ? calculateChange() : 0
        } 
      });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const isPaymentValid = parseFloat(cash) >= total || paymentMethod === 'card';

  return (
    <div className="p-4 border rounded-md shadow-sm bg-gray-50 h-[750px] flex flex-col">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Cash Card */}
        <div
          onClick={() => setPaymentMethod('cash')}
          className={`relative cursor-pointer p-4 border rounded-md shadow-sm text-center ${
            paymentMethod === 'cash' ? 'bg-blue-100 border-blue-800' : 'bg-white'
          }`}
        >
          <h3 className="text-lg font-medium">Cash</h3>
          <p className="text-sm text-gray-600">Pay with cash and get change if needed.</p>
        </div>

        {/* Card Payment Card */}
        <div
          onClick={() => setPaymentMethod('card')}
          className={`relative cursor-pointer p-4 border rounded-md shadow-sm text-center ${
            paymentMethod === 'card' ? 'bg-blue-100 border-blue-800' : 'bg-white'
          }`}
        >
          <h3 className="text-lg font-medium">Card</h3>
          <p className="text-sm text-gray-600">Pay with your credit or debit card.</p>
        </div>
      </div>

      {/* Cash Payment Interface */}
      {paymentMethod === 'cash' && (
        <div className="flex-1 flex flex-col mb-16">  {/* Added margin bottom */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Cash Input */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Cash Received:</label>
              <input
                type="text"
                value={`${cash} MAD`}
                readOnly
                className="w-full p-3 border rounded-md bg-gray-100 text-lg text-center shadow-sm"
              />
            </div>
            {/* Change Display */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Change:</label>
              <input
                type="text"
                value={`${calculateChange().toFixed(2)} MAD`}
                readOnly
                className="w-full p-3 border rounded-md bg-gray-100 text-lg text-center shadow-sm"
              />
            </div>
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[...Array(9)].map((_, index) => (
              <button
                key={index + 1}
                className="p-4 bg-white border rounded-md shadow-sm text-lg font-medium hover:bg-gray-100"
                onClick={() => handleNumberClick((index + 1).toString())}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="p-4 bg-white border rounded-md shadow-sm text-lg font-medium hover:bg-gray-100"
              onClick={handleBackspace}
            >
              ⌫
            </button>
            <button
              className="p-4 bg-white border rounded-md shadow-sm text-lg font-medium hover:bg-gray-100"
              onClick={() => handleNumberClick('0')}
            >
              0
            </button>
            <button
              className="p-4 bg-red-100 border rounded-md shadow-sm text-lg font-medium hover:bg-red-200"
              onClick={handleClear}
            >
              C
            </button>
          </div>
        </div>
      )}

      {/* Card Payment Message */}
      {paymentMethod === 'card' && (
        <div className="flex-1 flex items-center justify-center mb-4">
          <p className="text-gray-500 text-center text-lg">
            <span className="font-medium">Card payment selected.</span>
            <br />
            Proceed to the next step for card processing.
          </p>
        </div>
      )}

      {/* Fixed "Validate Payment" Button */}
      <div className="fixed bottom-4 left-2/3 transform -translate-x-1/2 w-full max-w-[400px]">
        <button
          className={`w-full py-4 rounded-md shadow-lg text-lg font-semibold ${
            isPaymentValid
              ? 'bg-blue-800 text-white hover:bg-blue-900'
              : 'bg-blue-100 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handlevalidate}
          disabled={!isPaymentValid}
        >
          Validate Payment
        </button>
      </div>
    </div>
  );
}

export default Method;
