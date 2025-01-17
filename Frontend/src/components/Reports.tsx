import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DayReport {
  _id: string;
  date: Date;
  totalRevenue: number;
  totalOrders: number;
  orders: Array<{
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
  }>;
}

function Reports() {
  const [reports, setReports] = useState<DayReport[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchReports(selectedDate);
    }
  }, [selectedDate]);

  const fetchReports = async (date: Date) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/order/reports`, {
        params: {
          date: date.toISOString()
        }
      });
      setReports(response.data as DayReport[]);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (date: Date) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/order/download-report`, {
        params: { date: date.toISOString() },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${date.toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Sales Reports</h2>
        <div className="flex gap-4 items-center">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            className="p-2 border rounded"
          />
          <button
            onClick={() => selectedDate && downloadReport(selectedDate)}
            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
          >
            Download Report
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        reports.map((report) => (
          <div key={report._id} className="mb-8 bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded">
                <h3 className="text-lg font-semibold">Total Revenue</h3>
                <p className="text-2xl font-bold text-blue-800">
                  {report.totalRevenue.toFixed(2)} MAD
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded">
                <h3 className="text-lg font-semibold">Total Orders</h3>
                <p className="text-2xl font-bold text-blue-800">
                  {report.totalOrders}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Items</th>
                    <th className="px-4 py-2">Payment</th>
                    <th className="px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report.orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="px-4 py-2">
                        {new Date(order.date).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2">{(order._id as string).slice(-6)}</td>
                      <td className="px-4 py-2">
                        {order.cartItems.map((item) => (
                          <div key={item.REF} className="text-xs">
                            {item.quantity}x {item.REF}
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-2">{order.paymentMethod}</td>
                      <td className="px-4 py-2">{order.totalPrice.toFixed(2)} MAD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Reports; 