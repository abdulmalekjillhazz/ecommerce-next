'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      router.push(location.state?.from?.pathname || '/');
    } catch {
      // error already captured in the store
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-3xl border border-[#2B2622]/10 bg-white px-8 py-10 shadow-xl shadow-[#2B2622]/5">

          {/* Header */}
          <div className="mb-8 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#B85C38]/10 text-xl">
              🔑
            </span>
            <h1 className="mt-4 text-2xl font-bold text-[#2B2622]">Welcome back</h1>
            <p className="mt-1 text-sm text-[#5A4F45]">Log in to your Tarzan account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5A4F45]">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-[#2B2622]/15 bg-[#FAF6EF] px-4 py-3 text-sm text-[#2B2622] placeholder-[#5A4F45]/40 outline-none transition focus:border-[#B85C38] focus:ring-2 focus:ring-[#B85C38]/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#5A4F45]">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border border-[#2B2622]/15 bg-[#FAF6EF] px-4 py-3 pr-11 text-sm text-[#2B2622] placeholder-[#5A4F45]/40 outline-none transition focus:border-[#B85C38] focus:ring-2 focus:ring-[#B85C38]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A4F45]/60 hover:text-[#2B2622]"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-[#2B2622] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B85C38] disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#2B2622]/10" />
            <span className="text-xs text-[#5A4F45]">new here?</span>
            <div className="h-px flex-1 bg-[#2B2622]/10" />
          </div>

          <Link
            href="/register"
            className="block w-full rounded-xl border-2 border-[#2B2622]/15 py-3 text-center text-sm font-semibold text-[#2B2622] transition hover:border-[#B85C38] hover:text-[#B85C38]"
          >
            Create an account
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#5A4F45]">
          Protected by end-to-end encryption.{' '}
          <span className="text-[#3F5B45]">🔒</span>
        </p>

      </div>
    </div>
  );
}