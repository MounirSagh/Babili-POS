import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Success() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser(); 

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      navigate('/');
    }
  }, [isLoaded, user, navigate]);


  return (
    <div className="relative h-[800px] w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/src/assets/vid001.mp4" type="video/mp4" />
      </video>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
        <h1 className="text-4xl font-bold mb-6">Payment Successful</h1>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-3 bg-blue-600 rounded-md text-lg font-semibold hover:bg-blue-700"
        >
          Go Back to Register
        </button>
      </div>
    </div>
  );
}

export default Success;