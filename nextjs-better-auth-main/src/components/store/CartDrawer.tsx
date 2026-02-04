'use client';

import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CURRENCY_SYMBOL } from '@/constants/products';

export default function CartDrawer() {
  const { cart, cartTotal, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();

  return (
    <div className={`fixed inset-0 overflow-hidden z-[60] ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-gray-500/75 transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsCartOpen(false)}
        />

        <div className={`fixed inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform duration-500 sm:duration-700 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button onClick={() => setIsCartOpen(false)} className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  {cart.length === 0 ? (
                    <div className="text-center py-10">
                      <ShoppingCart className="h-12 w-12 mx-auto text-gray-300" />
                      <p className="mt-2 text-gray-500">Your cart is empty.</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="mt-4 px-4 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cart.map((item) => (
                        <li key={item.id} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                            <Image src={item.image} alt={item.name} width={96} height={96} className="w-full h-full object-center object-cover" />
                          </div>
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                <p className="ml-4">{CURRENCY_SYMBOL}{item.price * item.quantity}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center border rounded-md">
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100"><Minus className="h-4 w-4" /></button>
                                <span className="px-2">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100"><Plus className="h-4 w-4" /></button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>{CURRENCY_SYMBOL}{cartTotal.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <button className="w-full flex justify-center items-center py-3 text-lg rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600">
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      or{' '}
                      <button onClick={() => setIsCartOpen(false)} className="text-indigo-600 font-medium hover:text-indigo-500">
                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
