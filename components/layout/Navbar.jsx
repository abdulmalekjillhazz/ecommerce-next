'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const totalItems = useCartStore((state) => state.totalItems);
  const toggleCartDrawer = useUIStore((state) => state.toggleCartDrawer);

  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        <Link
          href="/"
          className="text-lg font-bold text-gray-900"
        >
          ShopMERN
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-gray-700 sm:flex">
          <Link href="/products">
            Shop
          </Link>

          {user?.role === 'admin' && (
            <Link href="/admin">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">

          <button
            onClick={toggleCartDrawer}
            className="relative text-sm"
          >
            Cart

            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 rounded-full bg-indigo-600 px-1.5 text-xs text-white">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3 text-sm">

              <Link href="/profile">
                {user.name}
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-800"
              >
                Logout
              </button>

            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-indigo-600"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}
