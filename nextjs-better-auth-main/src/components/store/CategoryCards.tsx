'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CategoryCards() {
  const categories = [
    { name: 'Clothing', image: '/categories/clothing.jpg', query: 'Clothing' },
    { name: 'Hardware', image: '/categories/hardware.jpg', query: 'Hardware' },
    { name: 'Load Shedding', image: '/categories/load-shedding.jpg', query: 'Electronics' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Featured Categories
        </p>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          Quality goods curated for the South African lifestyle.
        </p>
      </div>

      <div className="mt-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => (
            <Link
              key={cat.name}
              href={`/shop?category=${cat.query}`}
              className={`cursor-pointer bg-gray-100 rounded-xl overflow-hidden relative group h-64 ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
