// import React, { useState } from "react";

// interface ListingsProps {
//   products: any[];
//   addToCart: (product: any) => void;
//   search: string;
// }

// function Listings({ products, addToCart, search }: ListingsProps) {
//   console.log('Products with subcategories:', products.map(item => ({
//     REF: item.REF,
//     subcategoryId: item.subcategoryId,
//     subcategory: item.subcategory,
//     image: item.subcategory?.image
//   })));

//   const filteredItems = products.filter((item) =>
//     item.REF.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="h-[750px] overflow-y-scroll">
//       {filteredItems.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//           <svg 
//             className="w-16 h-16 mb-4" 
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <p className="text-xl font-medium">No products found</p>
//           <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//           {filteredItems.map((item) => {
//             console.log('Item subcategory:', item.subcategory); // Debug log
//             return (
//               <div
//                 key={item._id}
//                 onClick={() => addToCart(item)}
//                 className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//               >
//                 <img 
//                   src={item.subcategoryID?.image || '/placeholder.png'}
//                   alt={item.REF} 
//                   className="w-full h-40 object-cover"
//                   onError={(e) => {
//                     console.log('Failed to load image for:', {
//                       REF: item.REF,
//                       subcategoryID: item.subcategoryID
//                     });
//                     const target = e.target as HTMLImageElement;
//                     target.src = '/placeholder.png';
//                   }}
//                 />
//                 <div className="p-2">
//                   <h3 className="text-sm font-semibold mb-2">{item.REF}</h3>
//                   <h3 className="text-sm font-semibold text-blue-800">{item.price} MAD</h3>
//                   {item.stock <= 0 && (
//                     <span className="text-xs text-red-500">Out of stock</span>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Listings;

import React from "react";

interface ListingsProps {
  products: any[];
  addToCart: (product: any) => void;
  search: string;
}

function Listings({ products, addToCart, search }: ListingsProps) {
  const filteredItems = products.filter((item) =>
    item.REF.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredItems.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">
          <p>No products found. Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        filteredItems.map((item) => (
          <div
            key={item._id}
            onClick={() => addToCart(item)}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <img
              src={item.subcategoryID?.image || '/placeholder.png'}
              alt={item.REF}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{item.REF}</h3>
              <p className="text-sm font-medium text-blue-800">{item.price} MAD</p>
              {item.stock <= 0 && (
                <span className="text-xs text-red-500">Out of stock</span>
              )}
             
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Listings;
