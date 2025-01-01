import React from 'react';
import { useLocation } from 'react-router-dom';
import Method from '../components/Method';
import Summary from '../components/Summary';

function Payment() {
  const location = useLocation();
  const cart: any = location.state?.cart || [];

  return (
    <div className="flex p-2 gap-8">
      <div className="w-1/3">
        <Summary cart={cart} /> 
      </div>
      <div className="w-2/3">
        <Method cart={cart}/>
      </div>
    </div>
  );
}

export default Payment;