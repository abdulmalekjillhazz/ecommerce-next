'use client';

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white py-8 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} ShopMERN. All rights reserved.
    </footer>
  );
}
