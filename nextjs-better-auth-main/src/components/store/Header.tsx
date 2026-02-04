'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, User, Store } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useView } from '@/contexts/ViewContext';
import LoginModal from './LoginModal';
import { useSession, signOut } from '@/lib/auth/client';

export default function Header() {
  const router = useRouter();
  const { cartItemCount, setIsCartOpen } = useCart();
  const { setSearchQuery, selectedCategory, setSelectedCategory } = useView();
  const { data: session, isPending } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Store className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="font-bold text-xl text-gray-900">SouthStore</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                href="/shop?category=Clothing"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Clothing
              </Link>
              <Link
                href="/shop?category=Hardware"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Hardware
              </Link>
              <Link
                href="/shop"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Shop All
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full hover:bg-gray-100 ${isSearchOpen ? 'text-indigo-600 bg-gray-50' : 'text-gray-400 hover:text-gray-500'}`}
              >
                <Search className="h-6 w-6" />
              </button>

              {isPending ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              ) : session ? (
                <div className="relative group">
                  <button className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium text-sm">
                        {session.user.name?.charAt(0).toUpperCase() ||
                         session.user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </button>

                  {/* 下拉菜单 */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        await signOut();
                        router.push('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
                  title="Login"
                >
                  <User className="h-6 w-6" />
                </button>
              )}

              <div className="relative">
                <button onClick={() => setIsCartOpen(true)} className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold border-2 border-white">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="border-t border-gray-100 bg-white py-4 animate-in slide-in-from-top-2 fade-in-20 duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search products..."
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Home
              </Link>
              <Link
                href="/shop?category=Clothing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Clothing
              </Link>
              <Link
                href="/shop?category=Hardware"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Hardware
              </Link>
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Shop All
              </Link>
            </div>
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
