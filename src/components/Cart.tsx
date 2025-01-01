import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, updateQuantity }: any) {

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(cart.length / itemsPerPage);

  // Calculate the items to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cart.slice(startIndex, endIndex);

  const totalPrice = cart.reduce(
    (acc: any, item: any) => acc + item.quantity * item.price,
    0
  );

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 ">
      {cart.length === 0 ? (
        <p className="flex items-center justify-center text-gray-500 h-[650px]">Start Adding Products.</p>
      ) : (
        <>
          <div className="space-y-4 h-[475px]">
            {currentItems.map((item: any) => (
              <div key={item.id} className="flex space-x-4 pb-4 border-b">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Price: {item.price} MAD</p>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <p className="text-sm text-gray-600">Quantity: </p>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <h1>{item.quantity}</h1>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.quantity * item.price} MAD</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              className="px-4 py-2 bg-blue-800 rounded disabled:opacity-50 text-white"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-blue-800 rounded disabled:opacity-50 text-white"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <h3 className="text-xl font-bold">Total:</h3>
            <p className="text-2xl font-bold text-blue-800">{totalPrice} MAD</p>
          </div>
          <button className="mt-6 w-full bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 transition-colors" onClick={() => navigate('/payment', { state: { cart } })}>
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;