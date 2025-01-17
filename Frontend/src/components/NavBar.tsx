import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white text-black p-4 mb-2 border relative">
      <div className="container mx-auto flex justify-between items-center">
        <button 
          ref={buttonRef}
          className="text-gray-800 p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <Link to="/home">
          <img 
            src='src/assets/LOGO-Babili-3.png' 
            width={100} 
            className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity" 
            alt="Babili Logo"
          />
        </Link>

        <div className="w-6"></div>
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className="absolute left-4 top-full w-56 bg-white border shadow-lg rounded-lg py-1 z-50">
          <Link 
            to="/day-end" 
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="ml-2">Day End Summary</span>
          </Link>
          <Link 
            to="/reports" 
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="ml-2">View Reports</span>
          </Link>
        </div>
      )}
    </header>
  );
}

