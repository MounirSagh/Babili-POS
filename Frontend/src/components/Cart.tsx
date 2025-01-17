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
    <div className="bg-white shadow-md rounded-lg p-4">
      {cart.length === 0 ? (
        <p className="flex items-center justify-center text-gray-500 h-[600px]">Start Adding Products.</p>
      ) : (
        <>
          <div className="space-y-2 h-[380px] overflow-y-auto">
            {currentItems.map((item: any) => (
              <div key={item._id} className="flex space-x-2 pb-2 border-b">
                <img 
                  src={item.subcategoryID?.image || '/placeholder.png'}
                  alt={item.REF} 
                  className="w-10 h-10 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.png';
                  }}
                />
                <div className="flex-grow">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-600">Price: {item.price} MAD</p>
                  <div className="flex items-center gap-1 mt-1 text-gray-600">
                    <p className="text-xs text-gray-600">Quantity: </p>
                    <button
                      className="px-1.5 py-0.5 bg-gray-200 rounded text-sm"
                      onClick={() => updateQuantity(item._id, -1)}
                    >
                      -
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      className="px-1.5 py-0.5 bg-gray-200 rounded text-sm"
                      onClick={() => updateQuantity(item._id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{item.quantity * item.price} MAD</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between items-center text-sm">
            <button
              className="px-2 py-1 bg-blue-800 rounded disabled:opacity-50 text-white text-sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-2 py-1 bg-blue-800 rounded disabled:opacity-50 text-white text-sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <h3 className="text-lg font-bold">Total:</h3>
            <p className="text-xl font-bold text-blue-800">{totalPrice} MAD</p>
          </div>
          <button 
            className="mt-3 w-full bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 transition-colors text-sm"
            onClick={() => navigate('/payment', { state: { cart } })}
          >
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;