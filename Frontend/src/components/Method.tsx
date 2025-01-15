import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handlevalidate = () => {
    navigate('/success')
  }

  const isPaymentValid = parseFloat(cash) >= total || paymentMethod === 'card';

  return (
    <div className="relative p-4 border rounded-md shadow-sm bg-gray-50 h-[750px]">
      <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Cash Card */}
        <div
          onClick={() => setPaymentMethod('cash')}
          className={`relative cursor-pointer p-4 border rounded-md shadow-sm text-center ${
            paymentMethod === 'cash' ? 'bg-blue-100 border-blue-800' : 'bg-white'
          }`}
        >
          <h3 className="text-lg font-medium">Cash</h3>
          <p className="text-gray-600">Pay with cash and get change if needed.</p>
        </div>

        {/* Card Payment Card */}
        <div
          onClick={() => setPaymentMethod('card')}
          className={`relative cursor-pointer p-4 border rounded-md shadow-sm text-center ${
            paymentMethod === 'card' ? 'bg-blue-100 border-blue-800' : 'bg-white'
          }`}
        >
          <h3 className="text-lg font-medium">Card</h3>
          <p className="text-gray-600">Pay with your credit or debit card.</p>
        </div>
      </div>

      {/* Conditional Rendering for Cash */}
      {paymentMethod === 'cash' && (
        <div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Cash Received:</label>
            <input
              type="text"
              value={`${cash} MAD`}
              readOnly
              className="w-full p-3 border rounded-md bg-gray-100 text-xl text-center shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Change:</label>
            <input
              type="text"
              value={`${calculateChange().toFixed(2)} MAD`}
              readOnly
              className="w-full p-3 border rounded-md bg-gray-100 text-xl text-center shadow-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Number Buttons */}
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

      {/* Placeholder for Card Payment */}
      {paymentMethod === 'card' && (
        <p className="text-gray-500">
          <span className="font-medium">Card payment selected.</span> Proceed to the next step for card processing.
        </p>
      )}

      {/* Validate Payment Button */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
        <button
          className={`p-4 rounded-md shadow-lg text-lg font-semibold ${
            isPaymentValid ? 'bg-blue-800 text-white hover:bg-blue-900' : 'bg-blue-100 text-gray-500 cursor-not-allowed'
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