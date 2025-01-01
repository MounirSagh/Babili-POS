import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/NavBar';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Initial from './pages/Initial';

function App() {
  return (
    <div className="bg-gray-100 h-screen">
      <Header />
      <main className="">
        <Routes>
        <Route path="/" element={<Initial />} />
          <Route path="/home" element={<Home />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

