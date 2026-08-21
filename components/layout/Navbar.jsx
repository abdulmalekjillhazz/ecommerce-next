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
    <header className="sticky top-0 z-30 border-b border-[#2B2622]/10 bg-[#FAF6EF]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B85C38] text-sm font-bold text-white">
            L
          </span>
          <span className="text-xl font-bold tracking-tight text-[#2B2622]">
            Larkspur
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#5A4F45] sm:flex">
          <Link href="/products" className="transition hover:text-[#B85C38]">
            Shop
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className="transition hover:text-[#B85C38]">
              Admin
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {/* Cart */}
          <button
            onClick={toggleCartDrawer}
            className="relative rounded-full p-2 text-[#2B2622] transition hover:bg-[#2B2622]/5"
            aria-label="Open cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.756-3.98 2.298-5.397.155-.402-.14-.837-.57-.837H5.106M7.5 14.25L5.106 5.272M7.5 14.25L5.272 5.106M6.75 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B85C38] text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3 text-sm">
              <Link
                href="/profile"
                className="font-medium text-[#2B2622] transition hover:text-[#B85C38]"
              >
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-[#5A4F45] transition hover:text-[#2B2622]"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-[#2B2622] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#B85C38]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
