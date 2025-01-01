import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <header className="bg-white text-black p-4 mb-2 border">
      <div className="container mx-auto flex justify-center items-center">
        <img src='src/assets/LOGO-Babili-3.png' width={100} className="text-2xl font-bold" />
      </div>
    </header>
  );
}

