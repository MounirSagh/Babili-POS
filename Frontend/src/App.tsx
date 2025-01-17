import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/NavBar';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Initial from './pages/Initial';
import SignIn from './pages/Sign-In';
import Reports from './components/Reports';

function App() {
  return (
    <div className="bg-gray-100 h-screen">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<SignIn />} /> {/* Updated default route */}
          <Route path="/initial" element={<Initial />} /> {/* Moved Initial to a separate route */}
          <Route path="/home" element={<Home />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<Success />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;