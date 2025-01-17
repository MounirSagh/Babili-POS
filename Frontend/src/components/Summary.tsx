import React, { useState } from 'react';

function Summary({ cart }: any) {
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(cart.length / itemsPerPage);

  const total = cart.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0);
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
      
      <div className="space-y-4 h-[480px] overflow-y-auto">
        {currentItems.map((item: any) => (
          <div
            key={item._id}
            className="flex justify-between p-3 border rounded-md bg-blue-50 shadow-sm hover:bg-blue-100 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <img 
                  src={item.subcategoryID?.image || '/placeholder.png'}
                  alt={item.REF} 
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.png';
                  }}
                />
                <div>
                  <p className="font-medium text-gray-800">REF: {item.REF}</p>
                  <p className="text-sm text-gray-600">
                    Category: {item.subcategoryID?.name || 'N/A'}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-600">
                      Quantity: <span className="font-semibold">{item.quantity}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: <span className="font-semibold">{item.price} MAD</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-lg font-semibold text-blue-800">
                {(item.price * item.quantity).toFixed(2)} MAD
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-4">
        <h3 className="text-xl font-bold text-right text-blue-900">
          Total: {total.toFixed(2)} MAD
        </h3>
      </div>

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
//hi 