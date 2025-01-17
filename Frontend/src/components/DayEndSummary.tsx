import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface DailySale {
  _id: string;
  date: string;
  totalPrice: number;
  cartItems: Array<{
    REF: string;
    quantity: number;
    price: number;
    subcategoryID: { name: string };
  }>;
  paymentMethod: 'cash' | 'card';
}

function DayEndSummary() {
  const navigate = useNavigate();
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDailySales();
  }, []);

  const fetchDailySales = async () => {
    try {
      setLoading(true);
      const response = await axios.get<DailySale[]>('http://localhost:3000/api/order/daily-summary');
      setDailySales(response.data || []);
      
      const revenue = (response.data || []).reduce((acc, order) => acc + order.totalPrice, 0);
      setTotalRevenue(revenue);
      setTotalOrders(response.data?.length || 0);
      setError(null);
    } catch (error) {
      console.error('Error fetching daily sales:', error);
      setError('Failed to load daily sales');
      setDailySales([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEndDay = async () => {
    try {
      // First get the daily summary
      const summaryResponse = await axios.post('http://localhost:3000/api/order/end-day');
      console.log('Day ended successfully:', summaryResponse.data);

      // Generate report
      const reportResponse = await axios.get(`http://localhost:3000/api/order/download-report`, {
        params: { date: new Date().toISOString() },
        responseType: 'blob'
      });

      // Download the report
      const url = window.URL.createObjectURL(new Blob([reportResponse.data as BlobPart]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Navigate back to initial page
      navigate('/initial');
    } catch (error) {
      console.error('Error ending day:', error);
      setError(error instanceof Error ? error.message : 'Failed to end day');
    }
  };

  if (loading) {
    return <div>Loading daily summary...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Daily Sales Summary</h2>
        <button
          onClick={handleEndDay}
          className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
        >
          End Day
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-800">{totalRevenue.toFixed(2)} MAD</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-800">{totalOrders}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Ticket #</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Products</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {dailySales.map((sale) => (
              <tr key={sale._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{sale._id.slice(-6)}</td>
                <td className="px-6 py-4">
                  {new Date(sale.date).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4">
                  {sale.cartItems?.map((item) => (
                    <div key={item.REF} className="text-xs">
                      {item.quantity}x {item.REF} ({item.subcategoryID?.name || 'N/A'})
                    </div>
                  )) || 'No items'}
                </td>
                <td className="px-6 py-4">{sale.paymentMethod}</td>
                <td className="px-6 py-4 font-semibold">{sale.totalPrice.toFixed(2)} MAD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DayEndSummary; 