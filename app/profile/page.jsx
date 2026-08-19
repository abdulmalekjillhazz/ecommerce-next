'use client';

import { useAuthStore } from '@/store/useAuthStore';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">My Profile</h1>
      <div className="space-y-3 rounded-lg border bg-white p-4 text-sm">
        <p>
          <span className="text-gray-500">Name:</span> {user?.name}
        </p>
        <p>
          <span className="text-gray-500">Email:</span> {user?.email}
        </p>
        <p>
          <span className="text-gray-500">Role:</span> {user?.role}
        </p>
      </div>
    </div>
  );
}
