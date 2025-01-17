import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Method from '../components/Method';
import Summary from '../components/Summary';
import { useUser } from '@clerk/clerk-react';

function Payment() {
  const location = useLocation();
  const cart: any = location.state?.cart || [];
  const { user, isLoaded } = useUser(); 
  const navigate = useNavigate()
  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      navigate('/');
    }
  }, [isLoaded, user, navigate]);


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