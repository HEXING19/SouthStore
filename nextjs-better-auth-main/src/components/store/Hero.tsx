'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative bg-indigo-900">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-30"
          src="/hero-banner.jpg"
          alt="Warehouse"
        />
        <div className="absolute inset-0 bg-indigo-900 mix-blend-multiply" aria-hidden="true" />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Everything You Need,<br/>From Joburg to Cape Town
        </h1>
        <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
          Quality hardware for the job site and stylish clothing for the weekend. Fast delivery nationwide.
        </p>
        <div className="mt-10">
          <Link
            href="/shop"
            className="px-8 py-4 text-lg rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
