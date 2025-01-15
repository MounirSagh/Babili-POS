import React, { useState } from 'react';

function Summary({ cart }: any) {
  const itemsPerPage = 15; // Items per page
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(cart.length / itemsPerPage);

  const total = cart.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0);

  // Get current page items
  const currentItems = cart.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-lg bg-white h-[750px] overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Order Summary</h2>
      
      <div className="space-y-4 h-[600px] overflow-y-auto">
        {currentItems.map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-3 border rounded-md bg-blue-100 shadow-sm hover:bg-gray-200"
          >
            <div>
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p className="text-lg font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-bold text-right mt-4 text-blue-900">Total: ${total.toFixed(2)}</h3>

      {/* Pagination Controls */}
      {cart.length > itemsPerPage && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            className={`p-2 rounded-md text-white font-medium ${
              currentPage === 1 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-lg font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`p-2 rounded-md text-white font-medium ${
              currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Summary;