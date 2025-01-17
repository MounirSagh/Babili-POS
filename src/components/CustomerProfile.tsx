import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CustomerProfile({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    axios.get(`/api/customers/${customerId}`)
      .then(response => setCustomer(response.data))
      .catch(error => console.error('Error fetching customer data', error));
  }, [customerId]);

  return (
    <div>
      {customer ? (
        <div>
          <h2>{customer.name}</h2>
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone}</p>
          <p>Loyalty Points: {customer.loyaltyPoints}</p>
        </div>
      ) : (
        <p>Loading customer profile...</p>
      )}
    </div>
  );
}

export default CustomerProfile; 