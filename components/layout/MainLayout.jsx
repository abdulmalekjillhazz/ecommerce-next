'use client';

import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import ToastContainer from '../common/ToastContainer';

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
}
